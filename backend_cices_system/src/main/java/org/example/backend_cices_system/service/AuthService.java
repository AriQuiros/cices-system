package org.example.backend_cices_system.service;
import org.example.backend_cices_system.data.*;
import org.example.backend_cices_system.dto.LoginResponse;
import org.example.backend_cices_system.dto.UserInfo;
import org.example.backend_cices_system.logic.*;
import org.example.backend_cices_system.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.example.backend_cices_system.dto.UsuarioRegistroDTO;
import java.time.LocalDate;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class AuthService {
    private final PasswordEncoder encoder;
    private final JwtUtil jwt;
    private final UsuarioRepository usuarioRepository;
    private final RolUsuarioRepository rolUsuarioRepository;
    private final EmpleadoRepository empleadoRepository;
    private final RolRepository rolRepository;
    private final InvestigadorRepository investigadorRepository;
    private final CertificacionRepository certificacionRepository;
    private final LoginAttemptService attemptService;


    public AuthService(
            UsuarioRepository usuarioRepository,
            RolUsuarioRepository rolUsuarioRepository,
            EmpleadoRepository empleadoRepository,
            RolRepository rolRepository,
            InvestigadorRepository investigadorRepository,
            PasswordEncoder encoder,
            JwtUtil jwt,
            CertificacionRepository certificacionRepository,
            LoginAttemptService attemptService
    ) {
        this.usuarioRepository = usuarioRepository;
        this.rolUsuarioRepository = rolUsuarioRepository;
        this.empleadoRepository = empleadoRepository;
        this.rolRepository = rolRepository;
        this.investigadorRepository = investigadorRepository;
        this.encoder = encoder;
        this.jwt = jwt;
        this.certificacionRepository = certificacionRepository;
        this.attemptService = attemptService;
    }

    public LoginResponse login(String username, String password) {
        if (attemptService.isBlocked(username))
            throw new org.springframework.security.authentication.LockedException("Usuario bloqueado por intentos fallidos");

        var u = usuarioRepository.findActiveByUsername(username)
                .orElseThrow(() -> {
                    attemptService.onFailure(username);
                    return new org.springframework.security.authentication.BadCredentialsException("Credenciales inválidas");
                });

        var stored = Optional.ofNullable(u.getContrasena()).orElse("").trim();
        if (stored.startsWith("{bcrypt}")) stored = stored.substring("{bcrypt}".length());

        boolean ok = !stored.isBlank() &&
                (stored.startsWith("$2") ? encoder.matches(password, stored) : stored.equals(password));

        if (!ok) {
            attemptService.onFailure(username);
            throw new org.springframework.security.authentication.BadCredentialsException("Credenciales inválidas");
        }

        attemptService.onSuccess(username);

        var roles = rolUsuarioRepository.findRoleNamesByUsuarioId(u.getId());
        var token = jwt.generate(u.getNombreUsuario(), roles);
        var nombre = u.getIdEmpleado() != null ? u.getIdEmpleado().getNombreCompleto() : null;

        return new LoginResponse(token, new UserInfo(u.getId(), u.getNombreUsuario(), nombre, roles));
    }


    @Transactional
    public void registrar(UsuarioRegistroDTO usuario) {
        // Validación de roles
        var roles = usuario.getRoles();
        if (roles == null || roles.isEmpty()) {
            throw new RuntimeException("Debe seleccionar al menos un rol");
        }
        // Roles principales permitidos
        String[] rolesPrincipales = {"DIRECTOR", "ADMINISTRADOR", "ASISTENTE"};
        boolean esInvestigador = roles.stream().anyMatch(r -> r.equalsIgnoreCase("INVESTIGADOR"));
        int otrosRoles = (int) roles.stream().filter(r -> {
            for (String principal : rolesPrincipales) {
                if (r.equalsIgnoreCase(principal)) return true;
            }
            return false;
        }).count();
        if (otrosRoles > 1) {
            throw new RuntimeException("Solo puede seleccionar un rol entre Director, Administrador o Asistente");
        }
        if (!esInvestigador && otrosRoles != 1) {
            throw new RuntimeException("Debe seleccionar al menos un rol principal");
        }

        // 1. Crear y guardar Empleado
        Empleado empleado = new Empleado();
        empleado.setNombreCompleto(usuario.getNombreCompleto());
        empleado.setNacionalidad(usuario.getNacionalidad());
        empleado.setIdCodigoTipoId(usuario.getIdCodigoTipoId());
        empleado.setIdentificacion(usuario.getIdentificacion());
        empleado.setCorreo(usuario.getCorreo());
        empleado.setNumeroTelefono(usuario.getTelefono());
        empleado = empleadoRepository.save(empleado);

        // 2. Crear y guardar Usuario
        Usuario nuevoUsuario = new Usuario();
        nuevoUsuario.setIdEmpleado(empleado);
        nuevoUsuario.setNombreUsuario(usuario.getNombreUsuario());
        nuevoUsuario.setContrasena(encoder.encode(usuario.getContrasena()));
        nuevoUsuario.setActivo(1L);
        nuevoUsuario = usuarioRepository.save(nuevoUsuario);

        // 3. Asignar Roles
        for (String nombreRol : roles) {
            Rol rol = (Rol) rolRepository.findByNombreRolIgnoreCase(nombreRol)
                .orElseThrow(() -> new RuntimeException("Rol no encontrado: " + nombreRol));
            RolUsuario rolUsuario = new RolUsuario();
            rolUsuario.setIdUsuario(nuevoUsuario);
            rolUsuario.setIdRol(rol);
            rolUsuarioRepository.save(rolUsuario);
        }

        // 4. Si es investigador, crear Investigador
        if (esInvestigador) {
            Investigador investigador = new Investigador();
            investigador.setIdEmpleado(empleado);
            investigador.setNumeroBecario(usuario.getNumeroBecario() != null && !usuario.getNumeroBecario().isBlank()
                    ? Integer.valueOf(usuario.getNumeroBecario()) : null);
            investigador.setUnidadAcademica(usuario.getUnidadAcademica());
            investigador.setInstitucionOrigen(usuario.getInstitucionOrigen());
            investigador.setIdCodigoGradoAcademico(usuario.getIdCodigoGradoAcademico());
            investigador = investigadorRepository.save(investigador);

            // Certificaciones
            if (usuario.getAcreditaciones() != null) {
                for (var a : usuario.getAcreditaciones()) {
                    Certificacion cert = new Certificacion();
                    cert.setIdInvestigador(investigador);

                    // nombre: usa el que exista
                    String nombre = a.getNombreCertificacion() != null ? a.getNombreCertificacion() : a.getText();
                    cert.setNombreCertificacion(nombre);

                    // fecha: LocalDate directo o parse de String "yyyy-MM-dd"
                    java.time.LocalDate fecha =
                            a.getFechaExpiracion() != null ? a.getFechaExpiracion()
                                    : (a.getDate() != null && !a.getDate().isBlank() ? java.time.LocalDate.parse(a.getDate()) : null);
                    if (fecha == null) throw new RuntimeException("Falta fecha de expiración en acreditación");
                    cert.setFechaExpiracion(fecha);

                    // tipo y estado: usa IDs del front si vienen; si no, defaults actuales
                    Short tipo = a.getIdCodigoTipoCertificacion() != null ? a.getIdCodigoTipoCertificacion() : (short)8;
                    Short estado = a.getIdCodigoTipoEstado() != null ? a.getIdCodigoTipoEstado() : (short)9;
                    cert.setIdCodigoTipoCertificacion(tipo);
                    cert.setIdCodigoTipoEstado(estado);

                    certificacionRepository.save(cert);
                }
            }
        }
    }
    public boolean existeIdentificacion(String identificacion) {
        return empleadoRepository.findAll().stream()
                .anyMatch(e -> e.getIdentificacion() != null && e.getIdentificacion().equals(identificacion));
    }
}

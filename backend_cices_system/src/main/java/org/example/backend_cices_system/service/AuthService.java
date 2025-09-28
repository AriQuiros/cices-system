package org.example.backend_cices_system.service;
import jakarta.validation.constraints.NotNull;
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
import java.time.format.DateTimeParseException;
import java.util.*;

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

            // dentro de registrar(...), justo antes de investigadorRepository.save(investigador):
            if (usuario.getUnidadAcademica() == null || usuario.getUnidadAcademica().isBlank())
                throw new IllegalArgumentException("unidadAcademica requerida");

            if (usuario.getInstitucionOrigen() == null || usuario.getInstitucionOrigen().isBlank())
                throw new IllegalArgumentException("institucionOrigen requerida");

            if (usuario.getIdCodigoGradoAcademico() == null)
                throw new IllegalArgumentException("idCodigoGradoAcademico requerido");

            investigador = investigadorRepository.save(investigador);

            // Certificaciones
           registrarCertificaciones(usuario,investigador);
        }
    }
    public boolean existeIdentificacion(String identificacion) {
        return empleadoRepository.findAll().stream()
                .anyMatch(e -> e.getIdentificacion() != null && e.getIdentificacion().equals(identificacion));
    }

    private void registrarCertificaciones(UsuarioRegistroDTO usuario, Investigador inv) {
        var acc = usuario.getAcreditaciones();
        if (acc == null || acc.isEmpty()) return;

        var hoy = java.time.LocalDate.now();
        var vistos = new java.util.HashSet<String>();
        var lote = new java.util.ArrayList<Certificacion>();

        for (var a : acc) {
            String nombre = a.getNombreCertificacion() != null ? a.getNombreCertificacion() : a.getText();
            if (nombre == null || nombre.isBlank()) throw new IllegalArgumentException("Nombre requerido");
            nombre = nombre.trim();
            if (!vistos.add(nombre.toLowerCase())) throw new IllegalArgumentException("Duplicado en la lista: " + nombre);

            if (certificacionRepository.existsByIdInvestigadorAndNombreCertificacionIgnoreCase(inv, nombre)) {
                throw new IllegalStateException("Ya existe para este investigador: " + nombre);
            }

            java.time.LocalDate fecha = a.getFechaExpiracion();
            if (fecha == null) {
                String ds = a.getDate();
                if (ds != null && !ds.isBlank()) {
                    try { fecha = java.time.LocalDate.parse(ds); }
                    catch (java.time.format.DateTimeParseException e) {
                        throw new IllegalArgumentException("Formato de fecha inválido: " + ds);
                    }
                }
            }
            if (fecha == null) throw new IllegalArgumentException("Falta fecha en: " + nombre);
            if (fecha.isBefore(hoy)) throw new IllegalArgumentException("Fecha debe ser hoy o futura en: " + nombre);

            if (a.getIdCodigoTipoCertificacion() == null)
                throw new IllegalArgumentException("Tipo de certificación requerido");

            short tipo = a.getIdCodigoTipoCertificacion();
            short estado = a.getIdCodigoTipoEstado() != null ? a.getIdCodigoTipoEstado() : (short)9;

            var c = new Certificacion();
            c.setIdInvestigador(inv);
            c.setNombreCertificacion(nombre);
            c.setFechaExpiracion(fecha);
            c.setIdCodigoTipoCertificacion(tipo);
            c.setIdCodigoTipoEstado(estado);
            lote.add(c);
        }
        certificacionRepository.saveAll(lote); // <- requerido por tu test
    }


}

package org.example.backend_cices_system.modules.persona.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.modules.persona.repository.EmpleadoRepository;
import org.example.backend_cices_system.modules.persona.dto.EmpleadoDTO;
import org.example.backend_cices_system.modules.persona.model.Empleado;
import org.example.backend_cices_system.modules.usuario.model.Usuario;
import org.example.backend_cices_system.modules.usuario.service.UsuarioService;
import org.example.backend_cices_system.shared.catalogo.CatalogoService;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmpleadoService {

    private final EmpleadoRepository empleadoRepository;
    private final UsuarioService usuarioService;
    private final CatalogoService catalogoService;

    private void validarUnicos(EmpleadoDTO dto, Empleado existente) {
        if (existente == null || !existente.getIdentificacion().equals(dto.identificacion())) {
            if (existeIdentificacion(dto.identificacion())) {
                throw new IllegalStateException("La identificación '" + dto.identificacion() + "' ya se encuentra registrada");
            }
        }

        if (dto.usuario() != null) {

            String nuevoUsername = dto.usuario().nombreUsuario();

            String actualUsername = existente != null
                    ? existente.getIdUsuario().getNombreUsuario()
                    : null;

            if (existente == null || !nuevoUsername.equals(actualUsername)) {
                if (usuarioService.existeNombreUsuario(nuevoUsername)) {
                    throw new IllegalStateException("El nombre de usuario '" + nuevoUsername + "' ya se encuentra registrado");
                }
            }
        }
    }

    @Transactional
    public Empleado crearEmpleado(EmpleadoDTO dto) {

        validarUnicos(dto, null);

        Usuario usuario = usuarioService.guardarUsuario(dto.usuario());

        Empleado empleado = new Empleado();
        empleado.setIdUsuario(usuario);
        empleado.setNombreCompleto(dto.nombreCompleto());
        empleado.setIdentificacion(dto.identificacion());
        empleado.setIdCodigoTipoId(dto.tipoId().id());
        empleado.setPais(dto.pais());
        empleado.setCorreo(dto.correo());
        empleado.setNumeroTelefono(dto.numeroTelefono());
        empleado.setIdCodigoTipoGradoAcademico(dto.gradoAcademico().id());

        return empleadoRepository.save(empleado);
    }

    boolean existeIdentificacion(String identificacion) {
        return empleadoRepository.existsByIdentificacion(identificacion);
    }

    public Empleado obtenerPorUsuario(Usuario usuario){
        return empleadoRepository.findByIdUsuario(usuario)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado para usuario " + usuario.getNombreUsuario()));
    }

    public Empleado obtenerEmpleado(Integer id){
        return empleadoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));
    }

    public EmpleadoDTO obtenerPerfil(Usuario usuario){
        var empleado = obtenerPorUsuario(usuario);
        return obtenerEmpleadoDTO(empleado);
    }

    @Transactional
    public Empleado actualizarEmpleado(EmpleadoDTO dto) {

        Empleado empleado = obtenerEmpleado(dto.id());

        validarUnicos(dto, empleado);

        empleado.setIdentificacion(dto.identificacion());
        empleado.setNombreCompleto(dto.nombreCompleto());
        empleado.setPais(dto.pais());
        empleado.setCorreo(dto.correo());
        empleado.setNumeroTelefono(dto.numeroTelefono());

        if (dto.tipoId() != null) {
            empleado.setIdCodigoTipoId(dto.tipoId().id());
        }

        if (dto.gradoAcademico() != null) {
            empleado.setIdCodigoTipoGradoAcademico(dto.gradoAcademico().id());
        }

        if (dto.usuario() != null) {
            usuarioService.actualizarUsuario(dto.usuario());
        }

        return empleadoRepository.save(empleado);
    }

    public EmpleadoDTO obtenerEmpleadoDTO(Empleado empleado){
        return new EmpleadoDTO( empleado.getId(),
                empleado.getNombreCompleto(),
                empleado.getIdentificacion(),
                catalogoService.obtenerDto(empleado.getIdCodigoTipoId()),
                empleado.getPais(),
                empleado.getCorreo(),
                empleado.getNumeroTelefono(),
                catalogoService.obtenerDto(empleado.getIdCodigoTipoGradoAcademico()),
                usuarioService.obtenerDTO(empleado.getIdUsuario())
        );
    }

}

package org.example.backend_cices_system.service;

import jakarta.transaction.Transactional;
import org.example.backend_cices_system.data.EmpleadoRepository;
import org.example.backend_cices_system.dto.EmpleadoDTO;
import org.example.backend_cices_system.logic.Empleado;
import org.example.backend_cices_system.logic.Usuario;
import org.springframework.stereotype.Service;

@Service
public class EmpleadoService {

    private final EmpleadoRepository empleadoRepository;
    private final CatalogoService catalogoService;
    private final AuthService authService;

    EmpleadoService (EmpleadoRepository empleadoRepository, CatalogoService catalogoService,
                    AuthService authService) {
        this.empleadoRepository = empleadoRepository;
        this.catalogoService = catalogoService;
        this.authService = authService;
    }

    @Transactional
    public Empleado crearEmpleado(EmpleadoDTO dto) {

        if (existeIdentificacion(dto.identificacion()))
            throw new IllegalStateException("La identificación '" + dto.identificacion() + "' ya se encuentra registrada");

        if (authService.existeNombreUsuario(dto.usuario().nombreUsuario()))
            throw new IllegalStateException("El nombre de usuario '" + dto.usuario().nombreUsuario() + "' ya se encuentra registrado");

        // 1. Crear usuario
        Usuario usuario = authService.guardarUsuario(dto.usuario());

        // 2. Crear empleado
        Empleado empleado = new Empleado();
        empleado.setIdUsuario(usuario);
        empleado.setNombreCompleto(dto.nombreCompleto());
        empleado.setIdentificacion(dto.identificacion());

        Short codigoTipoId = catalogoService.codigoXNombreValor("TIPO_IDENTIFICACION", dto.tipoId());

        empleado.setIdCodigoTipoId(codigoTipoId);
        empleado.setPais(dto.pais());
        empleado.setCorreo(dto.correo());
        empleado.setNumeroTelefono(dto.numeroTelefono());

        Short codigoTipoGradoAcademico = catalogoService.codigoXNombreValor("GRADO_ACADEMICO", dto.gradoAcademico());

        empleado.setIdCodigoTipoGradoAcademico(codigoTipoGradoAcademico);

        empleado = empleadoRepository.save(empleado);


        return empleado;
    }

    boolean existeIdentificacion(String identificacion) {
        return empleadoRepository.existsByIdentificacion(identificacion);
    }
}

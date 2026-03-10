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
    private final AuthService authService;

    EmpleadoService (EmpleadoRepository empleadoRepository, AuthService authService) {
        this.empleadoRepository = empleadoRepository;
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
        empleado.setIdCodigoTipoId(dto.tipoId().id());
        empleado.setPais(dto.pais());
        empleado.setCorreo(dto.correo());
        empleado.setNumeroTelefono(dto.numeroTelefono());
        empleado.setIdCodigoTipoGradoAcademico(dto.gradoAcademico().id());

        empleado = empleadoRepository.save(empleado);


        return empleado;
    }

    boolean existeIdentificacion(String identificacion) {
        return empleadoRepository.existsByIdentificacion(identificacion);
    }
}

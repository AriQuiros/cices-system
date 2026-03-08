package org.example.backend_cices_system.service;

import org.example.backend_cices_system.data.RolProyectoRepository;
import org.example.backend_cices_system.logic.RolProyecto;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RolProyectoService {
    private final RolProyectoRepository rolProyectoRepository;

    public RolProyectoService(RolProyectoRepository rolProyectoRepository) {
        this.rolProyectoRepository = rolProyectoRepository;
    }

    public List<String> obtenerNombreRolesProyecto() {
        return rolProyectoRepository.findAll()
                .stream()
                .map(RolProyecto::getNombreRolProyecto)
                .collect(Collectors.toList());
    }

    public RolProyecto obtenerRolProyectoXNombre(String nombre) {
        return rolProyectoRepository.findByNombreRolProyectoIgnoreCase(nombre)
                .orElseThrow(() -> new RuntimeException("Rol de proyecto no encontrado para nombre: " + nombre));
    }

}

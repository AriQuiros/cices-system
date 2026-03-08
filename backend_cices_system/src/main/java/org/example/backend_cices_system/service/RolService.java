package org.example.backend_cices_system.service;

import org.example.backend_cices_system.data.RolRepository;
import org.example.backend_cices_system.logic.Rol;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RolService {
    private final RolRepository rolRepository;

    public RolService(RolRepository rolRepository) {
        this.rolRepository = rolRepository;
    }

    public List<String> obtenerNombreRoles() {
        return rolRepository.findAll()
                .stream()
                .map(Rol::getNombreRol)
                .collect(Collectors.toList());
    }

    public Rol obtenerRolXNombre(String nombre) {
        return rolRepository.findByNombreRolIgnoreCase(nombre)
                .orElseThrow(() -> new RuntimeException("Rol no encontrado para nombre: " + nombre));
    }

}

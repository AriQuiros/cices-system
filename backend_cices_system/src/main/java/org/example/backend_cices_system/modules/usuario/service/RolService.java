package org.example.backend_cices_system.modules.usuario.service;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.modules.usuario.repository.RolRepository;
import org.example.backend_cices_system.modules.usuario.dto.RolDTO;
import org.example.backend_cices_system.modules.usuario.model.Rol;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RolService {
    private final RolRepository rolRepository;

    public List<RolDTO> obtenerRolesDTO() {
        return rolRepository.findAll()
                .stream()
                .map(r->new RolDTO(r.getId(),r.getNombreRol()))
                .collect(Collectors.toList());
    }

    public Rol obtenerRol(Short id){
        return rolRepository.findById(id).orElseThrow(() -> new RuntimeException("Rol no encontrado para id: " + id));
    }

}

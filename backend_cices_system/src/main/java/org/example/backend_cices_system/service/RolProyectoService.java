package org.example.backend_cices_system.service;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.data.RolProyectoRepository;
import org.example.backend_cices_system.dto.RolProyectoDTO;
import org.example.backend_cices_system.logic.RolProyecto;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RolProyectoService {

    private final RolProyectoRepository rolProyectoRepository;

    public List<RolProyectoDTO> obtenerRolesProyectoDTO() {
        return rolProyectoRepository.findAll()
                .stream()
                .map(r -> new RolProyectoDTO(r.getId(),r.getNombreRolProyecto()))
                .collect(Collectors.toList());
    }

    public RolProyecto obtenerRolProyecto(Short id){
        return rolProyectoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rol de proyecto no encontrado para id: " + id));

    }

}

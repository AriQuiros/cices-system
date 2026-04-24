package org.example.backend_cices_system.modules.investigadorProyecto.service;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.modules.investigadorProyecto.repository.RolProyectoRepository;
import org.example.backend_cices_system.modules.investigadorProyecto.dto.RolProyectoDTO;
import org.example.backend_cices_system.modules.investigadorProyecto.model.RolProyecto;
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

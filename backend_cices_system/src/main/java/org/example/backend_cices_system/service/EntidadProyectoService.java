package org.example.backend_cices_system.service;

import jakarta.transaction.Transactional;
import org.example.backend_cices_system.data.EntidadProyectoRepository;
import org.example.backend_cices_system.dto.EntidadDTO;
import org.example.backend_cices_system.logic.Entidad;
import org.example.backend_cices_system.logic.EntidadProyecto;
import org.example.backend_cices_system.logic.Proyecto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EntidadProyectoService {

    private final EntidadProyectoRepository entidadProyectoRepository;
    private final EntidadService entidadService;

    public EntidadProyectoService(EntidadProyectoRepository entidadProyectoRepository, EntidadService entidadService) {
        this.entidadProyectoRepository = entidadProyectoRepository;
        this.entidadService = entidadService;
    }

    @Transactional
    public EntidadProyecto guardarEntidadProyecto(Proyecto proyecto, Entidad entidad) {
        if (existeEntidadProyecto(proyecto.getId(), entidad.getId())) {
            return null;
        }

        var entidadProyecto = new EntidadProyecto();
        entidadProyecto.setIdProyecto(proyecto);
        entidadProyecto.setIdEntidad(entidad);

        return entidadProyectoRepository.save(entidadProyecto);
    }

    public boolean existeEntidadProyecto(Integer idProyecto, Integer idEntidad) {
        return entidadProyectoRepository.existsByIdProyecto_IdAndIdEntidad_Id(idProyecto, idEntidad);
    }

    public List<EntidadDTO> obtenerEntidadesProyecto(Proyecto proyecto){
        return entidadProyectoRepository.findEntidadProyectoByIdProyecto(proyecto).stream()
                .map(e -> entidadService.obtenerDTO(e.getIdEntidad())).toList();
    }
}
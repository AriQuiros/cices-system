package org.example.backend_cices_system.service;

import org.example.backend_cices_system.data.EntidadRepository;
import org.example.backend_cices_system.dto.CodigoDTO;
import org.example.backend_cices_system.dto.EntidadDTO;
import org.example.backend_cices_system.logic.Entidad;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EntidadService {
    private final EntidadRepository entidadRepository;
    private final CatalogoService catalogoService;

    public EntidadService(EntidadRepository entidadRepository, CatalogoService catalogoService) {
        this.entidadRepository = entidadRepository;
        this.catalogoService = catalogoService;
    }

    public Entidad guardarEntidad(EntidadDTO dto) {

        Entidad entidad;

        if (dto.id() != null) {
            // EXISTENTE
            entidad = obtenerPorId(dto.id());
        } else {
            // NUEVA
            entidad = new Entidad();
            entidad.setNombre(dto.nombre());
            entidad.setIdCodigoTipoEntidad(dto.tipo().id());
            entidad = entidadRepository.save(entidad);
        }

        return entidad;
    }

    public Entidad obtenerPorId(Integer id){
        return entidadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Entidad no encontrada con id: " + id));
    }

    public List<EntidadDTO> obtenerTodos(){
        return entidadRepository.findAll().stream()
                .map(e -> new EntidadDTO(e.getId(),e.getNombre(),
                        catalogoService.obtenerDto(e.getIdCodigoTipoEntidad()))).toList();
    }
}
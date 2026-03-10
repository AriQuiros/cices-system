package org.example.backend_cices_system.service;

import org.example.backend_cices_system.data.EntidadRepository;
import org.example.backend_cices_system.dto.EntidadDTO;
import org.example.backend_cices_system.logic.Entidad;
import org.springframework.stereotype.Service;

@Service
public class EntidadService {
    private final EntidadRepository entidadRepository;
    private final CatalogoService catalogoService;

    public EntidadService(EntidadRepository entidadRepository, CatalogoService catalogoService) {
        this.entidadRepository = entidadRepository;
        this.catalogoService = catalogoService;
    }

    public Entidad guardarEntidad(EntidadDTO entidadDTO) {
        var entidad = new Entidad();
        String nombre = entidadDTO.nombre();

        // Verificar si la entidad ya existe antes de guardarla
        if (!existeEntidad(nombre)) {
            entidad.setNombre(nombre);
            Short codigoTipo = catalogoService.codigoXNombreValor("TIPO_ENTIDAD", entidadDTO.tipo());
            entidad.setIdCodigoTipoEntidad(codigoTipo);
            entidad.setPais(entidadDTO.pais());
            entidadRepository.save(entidad);
        }
        else
            entidad = codigoXNombre(nombre);

        return entidad;
    }

    public Entidad codigoXNombre(String nombre) {
        return entidadRepository.findByNombreIgnoreCase(nombre)
                .orElseThrow(() -> new RuntimeException("Código no encontrado para nombre: " + nombre));
    }

    public boolean existeEntidad(String nombre) {
        return entidadRepository.existsByNombreIgnoreCase(nombre);
    }
}
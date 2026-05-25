package org.example.backend_cices_system.service.entity;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.dto.entity.EntidadDTO;
import org.example.backend_cices_system.model.entity.Entidad;
import org.example.backend_cices_system.repository.entity.EntidadRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EntidadService {
    private final EntidadRepository entidadRepository;
    private final CatalogoService catalogoService;

    public Entidad guardarEntidad(EntidadDTO dto) {

        Entidad entidad;

        if (dto.id() != null) {
            // EXISTENTE
            entidad = obtenerPorId(dto.id());
        } else {
            // NUEVA
            entidad = new Entidad();
            entidad.setNombre(dto.nombre());
            if (dto.tipo().id() == null)
                entidad.setIdCodigoTipoEntidad(catalogoService.codigoXNombreValor("TIPO_ENTIDAD", dto.tipo().valor()));
            else
                entidad.setIdCodigoTipoEntidad(dto.tipo().id());
            entidad = entidadRepository.save(entidad);
        }

        return entidad;
    }

    public Entidad obtenerPorId(Integer id){
        return entidadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Entidad no encontrada con id: " + id));
    }

    public List<EntidadDTO> buscarPorNombreYTipo(String nombre, String tipo) {
        var tipoId = catalogoService.codigoXNombreValor("TIPO_ENTIDAD", tipo);
        String filtro = (nombre == null) ? "" : nombre;

        Pageable pageable = PageRequest.of(0, 5);

        return entidadRepository
                .findByNombreContainingIgnoreCaseAndIdCodigoTipoEntidad(filtro, tipoId, pageable)
                .stream()
                .map(this::obtenerDTO)
                .toList();
    }

    public EntidadDTO obtenerDTO (Entidad entidad){
        return new EntidadDTO(entidad.getId(),
                entidad.getNombre(),
                catalogoService.obtenerDto(entidad.getIdCodigoTipoEntidad()));
    }
}
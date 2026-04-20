package org.example.backend_cices_system.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.data.MetaRepository;
import org.example.backend_cices_system.dto.MetaDTO;
import org.example.backend_cices_system.logic.Meta;
import org.example.backend_cices_system.logic.ObjetivoEspecifico;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MetaService {

    private final MetaRepository metaRepository;
    private final CatalogoService catalogoService;
    private final IndicadorService indicadorService;

    @Transactional
    public Meta guardarMeta(MetaDTO metaDTO, ObjetivoEspecifico objetivoEspecifico) {
        var id = metaDTO.id();
        var meta = id != null ? obtenerMetaPorId(id) : new Meta();

        meta.setIdObjetivoEspecifico(objetivoEspecifico);
        meta.setDescripcion(metaDTO.descripcion());
        meta.setIdCodigoTipoMeta(metaDTO.tipo().id());

        if (metaDTO.tipo().valor().equalsIgnoreCase("CUANTITATIVA")) {
            meta.setCantidad(metaDTO.cantidad());
        }

        metaRepository.save(meta);

        // Guardar indicadores usando el IndicadorService
        metaDTO.indicadores().forEach(indicadorDTO ->
                indicadorService.guardarIndicador(indicadorDTO, meta)
        );

        return meta;
    }

    public Meta obtenerMetaPorId(Integer id) {
        return metaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Meta no encontrada para id: " + id));
    }

    public MetaDTO obtenerDTO(Meta meta) {
        return new MetaDTO(
                meta.getId(),
                catalogoService.obtenerDto(meta.getIdCodigoTipoMeta()),
                meta.getCantidad(),
                meta.getDescripcion(),
                indicadorService.obtenerDTOList(meta)
        );
    }

    public List<MetaDTO> metaDTOSList(ObjetivoEspecifico objetivoEspecifico) {
        return metaRepository.findMetaByIdObjetivoEspecifico(objetivoEspecifico).stream()
                .map(this::obtenerDTO)
                .toList();
    }
}
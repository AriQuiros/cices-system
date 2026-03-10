package org.example.backend_cices_system.service;

import jakarta.transaction.Transactional;
import org.example.backend_cices_system.data.IndicadorRepository;
import org.example.backend_cices_system.data.MetaRepository;
import org.example.backend_cices_system.dto.MetaDTO;
import org.example.backend_cices_system.logic.Indicador;
import org.example.backend_cices_system.logic.Meta;
import org.example.backend_cices_system.logic.ObjetivoEspecifico;
import org.springframework.stereotype.Service;

@Service
public class MetaService {
    MetaRepository metaRepository;
    IndicadorRepository indicadorRepository;

    public MetaService(MetaRepository metaRepository, IndicadorRepository indicadorRepository) {
        this.indicadorRepository = indicadorRepository;
        this.metaRepository = metaRepository;
    }

    @Transactional
    public Meta guardarMeta(MetaDTO metaDTO, ObjetivoEspecifico objetivoEspecifico) {
        var meta = new Meta();
        meta.setIdObjetivoEspecifico(objetivoEspecifico);
        meta.setDescripcion(metaDTO.descripcion());
        meta.setCantidad(metaDTO.cantidad());
        meta.setIdCodigoTipoMeta(metaDTO.tipo().id());

        metaRepository.save(meta);

        for(String indicadorDesc: metaDTO.indicadores()) {
            var indicador = new Indicador();
            indicador.setIdMeta(meta);
            indicador.setDescripcion(indicadorDesc);
            indicadorRepository.save(indicador);
        }

        return  meta;
    }
}

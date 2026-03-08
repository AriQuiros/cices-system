package org.example.backend_cices_system.service;

import jakarta.transaction.Transactional;
import org.example.backend_cices_system.data.ObjetivoEspecificoRepository;
import org.example.backend_cices_system.dto.MetaDTO;
import org.example.backend_cices_system.dto.ObjetivoEspecificoDTO;
import org.example.backend_cices_system.logic.ObjetivoEspecifico;
import org.example.backend_cices_system.logic.Proyecto;
import org.springframework.stereotype.Service;

@Service
public class ObjetivosEspecificosService {
    ObjetivoEspecificoRepository objetivoEspecificoRepository;
    MetaService MetaService;

    public ObjetivosEspecificosService(ObjetivoEspecificoRepository objetivoEspecificoRepository, MetaService MetaService) {
        this.MetaService = MetaService;
        this.objetivoEspecificoRepository = objetivoEspecificoRepository;
    }

    @Transactional
    public void guardarObjetivoEspecifico(ObjetivoEspecificoDTO objetivoEspecificoDTO, Proyecto proyecto) {
        var objetivoEspecifico = new ObjetivoEspecifico();
        objetivoEspecifico.setIdProyecto(proyecto);
        objetivoEspecifico.setDescripcion(objetivoEspecificoDTO.descripcion());

        objetivoEspecificoRepository.save(objetivoEspecifico);

        for(MetaDTO metaDTO: objetivoEspecificoDTO.metas()) {
            MetaService.guardarMeta(metaDTO, objetivoEspecifico);
        }
    }

}

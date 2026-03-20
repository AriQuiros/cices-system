package org.example.backend_cices_system.service;

import jakarta.transaction.Transactional;
import org.example.backend_cices_system.data.ObjetivoEspecificoRepository;
import org.example.backend_cices_system.dto.MetaDTO;
import org.example.backend_cices_system.dto.ObjetivoEspecificoDTO;
import org.example.backend_cices_system.logic.ObjetivoEspecifico;
import org.example.backend_cices_system.logic.Proyecto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ObjetivosEspecificosService {
    ObjetivoEspecificoRepository objetivoEspecificoRepository;
    MetaService metaService;

    public ObjetivosEspecificosService(ObjetivoEspecificoRepository objetivoEspecificoRepository, MetaService metaService) {
        this.metaService = metaService;
        this.objetivoEspecificoRepository = objetivoEspecificoRepository;
    }

    @Transactional
    public void guardarObjetivoEspecifico(ObjetivoEspecificoDTO objetivoEspecificoDTO, Proyecto proyecto) {
        var id = objetivoEspecificoDTO.id();
        var objetivoEspecifico =
               id != null ? obtenerPorId(id) : new ObjetivoEspecifico();
        objetivoEspecifico.setIdProyecto(proyecto);
        objetivoEspecifico.setDescripcion(objetivoEspecificoDTO.descripcion());

        objetivoEspecificoRepository.save(objetivoEspecifico);

        for(MetaDTO metaDTO: objetivoEspecificoDTO.metas()) {
            metaService.guardarMeta(metaDTO, objetivoEspecifico);
        }
    }

    public ObjetivoEspecifico obtenerPorId(Integer id){
        return objetivoEspecificoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Objetivo no encontrado para id: " + id));
    }

    public boolean existeObjetivo(Integer id){
        return objetivoEspecificoRepository.existsById(id);
    }

    private ObjetivoEspecificoDTO obtenerDTO (ObjetivoEspecifico objetivoEspecifico){
        return new ObjetivoEspecificoDTO(
                objetivoEspecifico.getId(), "",
                objetivoEspecifico.getDescripcion(),
                metaService.metaDTOSList(objetivoEspecifico)
        );
    }

    public List<ObjetivoEspecificoDTO> objetivoEspecificoDTOList(Proyecto proyecto){
        return objetivoEspecificoRepository.findObjetivoEspecificoByIdProyecto(proyecto).stream()
                .map(this::obtenerDTO).toList();
    }


}

package org.example.backend_cices_system.modules.proyecto.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.modules.proyecto.repository.ObjetivoEspecificoRepository;
import org.example.backend_cices_system.modules.proyecto.dto.MetaDTO;
import org.example.backend_cices_system.modules.proyecto.dto.ObjetivoEspecificoDTO;
import org.example.backend_cices_system.modules.proyecto.model.ObjetivoEspecifico;
import org.example.backend_cices_system.modules.proyecto.model.Proyecto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ObjetivosEspecificosService {

    private final ObjetivoEspecificoRepository objetivoEspecificoRepository;
    private final MetaService metaService;

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

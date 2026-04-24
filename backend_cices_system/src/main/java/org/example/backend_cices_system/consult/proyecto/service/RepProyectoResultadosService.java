package org.example.backend_cices_system.consult.proyecto.service;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.consult.proyecto.repository.RepProyectoResultadosRepository;
import org.example.backend_cices_system.consult.proyecto.view.RepProyectoResultados;
import org.example.backend_cices_system.export.dto.IndicadorReporteDTO;
import org.example.backend_cices_system.export.dto.MetaReporteDTO;
import org.example.backend_cices_system.export.dto.ObjetivoReporteDTO;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RepProyectoResultadosService {

    private final RepProyectoResultadosRepository repo;

    // obtener de varios proyectos
    public Map<Integer, List<ObjetivoReporteDTO>> obtenerPorProyectos(List<Integer> ids) {

        if (ids == null || ids.isEmpty()) {
            return Map.of();
        }

        List<RepProyectoResultados> filas = repo.findByIdProyectoIn(ids);

        return agruparPorProyecto(filas);
    }

    public List<ObjetivoReporteDTO> obtenerPorProyecto(Integer idProyecto) {

        if (idProyecto == null) {
            return List.of();
        }

        List<RepProyectoResultados> filas = repo.findByIdProyecto(idProyecto);
        if (filas == null || filas.isEmpty()) return List.of();

        return mapObjetivos(filas);
    }

    // Agrupacion
    private Map<Integer, List<ObjetivoReporteDTO>> agruparPorProyecto(List<RepProyectoResultados> filas) {

        return filas.stream()
                .collect(Collectors.groupingBy(
                        RepProyectoResultados::getIdProyecto,
                        Collectors.collectingAndThen(
                                Collectors.toList(),
                                this::mapObjetivos
                        )
                ));
    }

    // mapeo a dto's
    private List<ObjetivoReporteDTO> mapObjetivos(List<RepProyectoResultados> filas) {

        return filas.stream()
                .collect(Collectors.groupingBy(RepProyectoResultados::getIdObjetivoEspecifico))
                .values()
                .stream()
                .map(this::mapObjetivo)
                .toList();
    }

    // mapeo a dto
    private ObjetivoReporteDTO mapObjetivo(List<RepProyectoResultados> lista) {

        RepProyectoResultados first = lista.getFirst();

        List<MetaReporteDTO> metas = lista.stream()
                .collect(Collectors.groupingBy(RepProyectoResultados::getIdMeta))
                .values()
                .stream()
                .map(this::mapMeta)
                .toList();

        return new ObjetivoReporteDTO(
                first.getObjetivoEspecifico(),
                metas
        );
    }

    // metas
    private MetaReporteDTO mapMeta(List<RepProyectoResultados> lista) {

        RepProyectoResultados first = lista.getFirst();

        List<IndicadorReporteDTO> indicadores = lista.stream()
                .filter(r -> r.getIdIndicador() != null)
                .map(r -> new IndicadorReporteDTO(r.getIndicador()))
                .toList();

        return new MetaReporteDTO(
                first.getMeta(),
                first.getTipoMeta(),
                first.getCantidadMeta() != null ? first.getCantidadMeta().toString() : null,
                indicadores
        );
    }
}
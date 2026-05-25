package org.example.backend_cices_system.service.view;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.repository.view.RepProyectoPresentacionInformeRepository;
import org.example.backend_cices_system.model.view.RepProyectoPresentacionInforme;
import org.example.backend_cices_system.dto.export.InformeReporteDTO;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RepProyectoPresentacionInformeService {

    private final RepProyectoPresentacionInformeRepository repo;

    public Map<Integer, List<InformeReporteDTO>> obtenerPorProyectos(List<Integer> ids) {
        if (ids == null || ids.isEmpty()) return Map.of();

        List<RepProyectoPresentacionInforme> filas = repo.findByIdProyectoIn(ids);

        return filas.stream()
                .collect(Collectors.groupingBy(
                        RepProyectoPresentacionInforme::getIdProyecto,
                        Collectors.mapping(this::obtenerInformeReporteDTO, Collectors.toList())
                ));
    }

    public List<InformeReporteDTO> obtenerPorProyecto(Integer idProyecto) {
        if (idProyecto == null) return List.of();

        List<RepProyectoPresentacionInforme> filas = repo.findByIdProyecto(idProyecto);
        if (filas == null || filas.isEmpty()) return List.of();

        return filas.stream()
                .map(this::obtenerInformeReporteDTO)
                .toList();
    }

    public InformeReporteDTO obtenerInformeReporteDTO(RepProyectoPresentacionInforme informe){
        return new InformeReporteDTO(
                informe.getTipoInforme(),
                informe.getEstadoInforme(),
                informe.getFechaPresentacion()
        );
    }
}

package org.example.backend_cices_system.consult.presupuesto.service;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.consult.presupuesto.repository.RepPresupuestoHorasRepository;
import org.example.backend_cices_system.consult.presupuesto.view.RepPresupuestoHoras;
import org.example.backend_cices_system.export.dto.HorasAsignadasReporteDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RepPresupuestoHorasService {

    private final RepPresupuestoHorasRepository repo;

    public List<HorasAsignadasReporteDTO> buscarPorIdPresupuesto(Integer idPresupuesto){
        return repo.findByIdPresupuesto(idPresupuesto).stream()
                .map(this::obtenerHorasAsignadasReporteDTO)
                .toList();
    }

    public Page<HorasAsignadasReporteDTO> buscarPorIdPresupuestoPaginado(
            Integer idPresupuesto,
            Pageable pageable,
            String ordenarPor,
            String direccion
    ) {

        Sort sort = construirSort(ordenarPor, direccion);

        Pageable finalPageable = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                sort
        );

        return repo.findByIdPresupuesto(idPresupuesto, finalPageable)
                .map(this::obtenerHorasAsignadasReporteDTO);
    }

    public HorasAsignadasReporteDTO obtenerHorasAsignadasReporteDTO(RepPresupuestoHoras horasAsignadas) {
        return new HorasAsignadasReporteDTO(
                horasAsignadas.getIdHorasAsignadas(),
                horasAsignadas.getIdInvestigadorProyecto(),
                horasAsignadas.getNombreCompleto(),
                horasAsignadas.getModalidad(),
                horasAsignadas.getRolProyecto(),
                horasAsignadas.getFechaInicioInvestigador(),
                horasAsignadas.getFechaFinInvestigador(),
                "TEMPORAL",
                horasAsignadas.getCantidadHorasMes(),
                horasAsignadas.getCantidadMeses(),
                horasAsignadas.getTotalHorasPlanificadas()
        );
    }

    private Sort construirSort(String ordenarPor, String direccion) {
        Sort.Direction dir = "desc".equalsIgnoreCase(direccion)
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;

        return switch (ordenarPor) {
            case "total" -> Sort.by(dir, "totalHorasPlanificadas");
            case "fechaInicio" -> Sort.by(dir, "fechaInicioInvestigador");
            default -> Sort.unsorted();
        };
    }

    // Metodo principal: obtener horas asignadas por varios proyectos
    public Map<Integer, List<HorasAsignadasReporteDTO>> obtenerPorProyectosAgrupadoPorPresupuesto(List<Integer> idsProyectos) {
        if (idsProyectos == null || idsProyectos.isEmpty()) return Map.of();

        List<RepPresupuestoHoras> filas = repo.findByIdProyectoIn(idsProyectos);

        return filas.stream()
                .filter(Objects::nonNull) // para cuando no haya horas asignadas
                .collect(Collectors.groupingBy(
                        RepPresupuestoHoras::getIdPresupuesto,
                        Collectors.mapping(this::obtenerHorasAsignadasReporteDTO, Collectors.toList())
                ));
    }

    public Map<Integer, HorasAsignadasReporteDTO> obtenerHorasPorInvestigador(List<Integer> idsProyectos) {

        if (idsProyectos == null || idsProyectos.isEmpty()) return Map.of();

        List<RepPresupuestoHoras> filas = repo.findByIdProyectoIn(idsProyectos);

        return filas.stream()
                .filter(Objects::nonNull)
                .filter(f -> f.getIdInvestigadorProyecto() != null)
                .collect(Collectors.toMap(
                        RepPresupuestoHoras::getIdInvestigadorProyecto,
                        this::obtenerHorasAsignadasReporteDTO,
                        (h1, h2) -> h1 // por si hay duplicados
                ));
    }

    public Map<Integer, List<HorasAsignadasReporteDTO>> obtenerPorProyectosAgrupadoPorProyecto(List<Integer> idsProyectos) {

        if (idsProyectos == null || idsProyectos.isEmpty()) return Map.of();

        List<RepPresupuestoHoras> filas = repo.findByIdProyectoIn(idsProyectos);

        return filas.stream()
                .collect(Collectors.groupingBy(
                        RepPresupuestoHoras::getIdProyecto,
                        Collectors.mapping(this::obtenerHorasAsignadasReporteDTO, Collectors.toList())
                ));
    }

    public List<HorasAsignadasReporteDTO> obtenerPorProyecto(Integer idProyecto) {
        if (idProyecto == null) return List.of();
        return repo.findByIdProyecto(idProyecto).stream()
                .map(this::obtenerHorasAsignadasReporteDTO)
                .toList();
    }

    // Agregar después de obtenerPorProyecto():
    public Map<Integer, List<HorasAsignadasReporteDTO>> obtenerPorIdProyectoAgrupadoPorPresupuesto(Integer idProyecto) {
        if (idProyecto == null) return Map.of();
        return repo.findByIdProyecto(idProyecto)
                .stream()
                .filter(Objects::nonNull) // para cuando no haya horas asignadas
                .collect(Collectors.groupingBy(
                        RepPresupuestoHoras::getIdPresupuesto,
                        Collectors.mapping(this::obtenerHorasAsignadasReporteDTO, Collectors.toList())
                ));
    }
}

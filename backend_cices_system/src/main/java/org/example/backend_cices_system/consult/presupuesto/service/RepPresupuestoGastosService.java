package org.example.backend_cices_system.consult.presupuesto.service;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.consult.presupuesto.repository.RepPresupuestoGastosRepository;
import org.example.backend_cices_system.consult.presupuesto.view.RepPresupuestoGastos;
import org.example.backend_cices_system.export.dto.GastoReporteDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RepPresupuestoGastosService {

    private final RepPresupuestoGastosRepository repo;

    public List<GastoReporteDTO> buscarPorIdPresupuesto(
            Integer idPresupuesto
    ) {
        return repo.findByIdPresupuesto(idPresupuesto)
                .stream()
                .map(this::obtenerGastoReporteDTO).toList();
    }

    public Page<GastoReporteDTO> buscarPorIdPresupuestoPaginado(
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
                .map(this::obtenerGastoReporteDTO);
    }

    public GastoReporteDTO obtenerGastoReporteDTO(RepPresupuestoGastos gasto) {
        return new GastoReporteDTO(
                gasto.getIdGasto(),
                gasto.getDescripcion(),
                gasto.getMonto(),
                gasto.getFechaGasto()
        );
    }

    private Sort construirSort(String ordenarPor, String direccion) {
        Sort.Direction dir = "desc".equalsIgnoreCase(direccion)
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;

        return switch (ordenarPor) {
            case "fecha" -> Sort.by(dir, "fechaGasto");
            case "monto" -> Sort.by(dir, "monto");
            default -> Sort.unsorted();
        };
    }
    /**
     * Obtiene todos los gastos de los proyectos indicados,
     * agrupados por ID de presupuesto.
     */

    public Map<Integer, List<GastoReporteDTO>> obtenerPorProyectos(List<Integer> idsProyectos) {

        if (idsProyectos == null || idsProyectos.isEmpty()) return Map.of();

        List<RepPresupuestoGastos> filas = repo.findByIdProyectoIn(idsProyectos);

        return filas.stream()
                .collect(Collectors.groupingBy(
                        RepPresupuestoGastos::getIdPresupuesto,
                        Collectors.mapping(this::obtenerGastoReporteDTO, Collectors.toList())
                ));
    }

    public List<GastoReporteDTO> obtenerPorProyecto(Integer idProyecto) {
        if (idProyecto == null) return List.of();

        List<RepPresupuestoGastos> filas = repo.findByIdProyecto(idProyecto);
        if (filas == null || filas.isEmpty()) return List.of();

        return filas.stream()
                .map(this::obtenerGastoReporteDTO)
                .toList();
    }

    public Map<Integer, List<GastoReporteDTO>> obtenerPorIdProyectoAgrupadoPorPresupuesto(Integer idProyecto) {
        if (idProyecto == null) return Map.of();
        return repo.findByIdProyecto(idProyecto)
                .stream()
                .collect(Collectors.groupingBy(
                        RepPresupuestoGastos::getIdPresupuesto,
                        Collectors.mapping(this::obtenerGastoReporteDTO, Collectors.toList())
                ));
    }

}
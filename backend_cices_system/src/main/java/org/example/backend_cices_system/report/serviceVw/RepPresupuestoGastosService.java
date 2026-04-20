package org.example.backend_cices_system.report.serviceVw;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.report.dao.RepPresupuestoGastosRepository;
import org.example.backend_cices_system.report.view.RepPresupuestoGastos;
import org.example.backend_cices_system.reportes.dto.GastoReporteDTO;
import org.example.backend_cices_system.reportes.dto.PresupuestoReporteDTO;
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

    public List<GastoReporteDTO> buscarPorIdPresupuesto(Integer idPresupuesto) {
        return repo.findByIdPresupuesto(idPresupuesto)
                .stream()
                .map(this::obtenerGastoReporteDTO)
                .toList();
    }

    public Map<Integer,List<GastoReporteDTO>> agruparPorIdPresupuestos(List<Integer> idPresupuestos) {
        return repo.findByIdPresupuestoIn(idPresupuestos)
                .stream()
                .collect(Collectors.groupingBy(
                        RepPresupuestoGastos::getIdPresupuesto,
                        Collectors.mapping(this::obtenerGastoReporteDTO, Collectors.toList())
                ));
    }

    public Page<RepPresupuestoGastos> listarGastos(
            String ordenarPor, // "fecha", "monto"
            String direccion,
            int page
    ) {

        Sort sort = Sort.unsorted();

        if (ordenarPor != null) {
            Sort.Direction dir = "desc".equalsIgnoreCase(direccion)
                    ? Sort.Direction.DESC
                    : Sort.Direction.ASC;

            switch (ordenarPor) {
                case "fecha" -> sort = Sort.by(dir, "fechaGasto");
                case "monto" -> sort = Sort.by(dir, "monto");
            }
        }

        Pageable pageable = PageRequest.of(page, 10, sort);

        return repo.findAll(pageable);
    }

    public GastoReporteDTO obtenerGastoReporteDTO(RepPresupuestoGastos gasto) {
        return new GastoReporteDTO(
                gasto.getIdGasto(),
                gasto.getDescripcion(),
                gasto.getMonto(),
                gasto.getFechaGasto()
        );
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

}
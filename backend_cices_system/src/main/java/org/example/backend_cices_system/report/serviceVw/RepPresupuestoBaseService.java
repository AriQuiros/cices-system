package org.example.backend_cices_system.report.serviceVw;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.report.dao.RepPresupuestoBaseRepository;
import org.example.backend_cices_system.report.dto.PresupuestoDatosDTO;
import org.example.backend_cices_system.report.filter.PresupuestoFiltroDTO;
import org.example.backend_cices_system.report.specification.PresupuestoSpecification;
import org.example.backend_cices_system.report.view.RepPresupuestoBase;
import org.example.backend_cices_system.reportes.dto.GastoReporteDTO;
import org.example.backend_cices_system.reportes.dto.HorasAsignadasReporteDTO;
import org.example.backend_cices_system.reportes.dto.PresupuestoReporteDTO;
import org.example.backend_cices_system.reportes.dto.PresupuestoResumenReporteDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RepPresupuestoBaseService {

    private final RepPresupuestoBaseRepository repo;
    private final RepPresupuestoGastosService repPresupuestoGastosService;
    private final RepPresupuestoHorasService repPresupuestoHorasService;

    public Page<RepPresupuestoBase> buscarPresupuestos(
            PresupuestoFiltroDTO filtro,
            String ordenarPor,   // "fecha", "monto", "horas"
            String direccion,    // "asc" | "desc"
            int page
    ) {

        Specification<RepPresupuestoBase> spec =
                PresupuestoSpecification.filtrar(
                        filtro
                );

        Sort sort = Sort.unsorted();

        if (ordenarPor != null) {

            Sort.Direction dir = "desc".equalsIgnoreCase(direccion)
                    ? Sort.Direction.DESC
                    : Sort.Direction.ASC;

            switch (ordenarPor) {
                case "fecha" -> sort = Sort.by(dir, "fechaAsignacion");
                case "monto" -> sort = Sort.by(dir, "montoAsignado");
                case "horas" -> sort = Sort.by(dir, "horasAsignadas");
            }
        }

        Pageable pageable = PageRequest.of(page, 8, sort);

        return repo.findAll(spec, pageable);
    }

    public RepPresupuestoBase obtenerPorIdPresupuesto(Integer idPresupuesto){
        return repo.findById(idPresupuesto).orElseThrow(
                () -> new RuntimeException("Presupuesto no encontrado con id: " + idPresupuesto));
    }

    public List<RepPresupuestoBase> presupuestoPorTipoYCodigoProyecto(String codigoProyecto, String tipo) {
        return repo.findByCodigoProyectoAndTipoPresupuestoContainsIgnoreCase(codigoProyecto, tipo);
    }

    public List<PresupuestoReporteDTO> consultaHorasPorCodigoProyecto(String codigoProyecto) {
        var presupuestos = presupuestoPorTipoYCodigoProyecto(codigoProyecto, "HORAS");
        var ids = presupuestos.stream().map(RepPresupuestoBase::getIdPresupuesto).toList();
        var horas = repPresupuestoHorasService.agruparPorIdPresupuestos(ids);

        return presupuestos
                .stream()
                .map(rep -> this.obtenerPresupuestoReporteDTO(
                        rep,
                        null,
                        horas.getOrDefault(rep.getIdPresupuesto(), List.of())
                ))
                .toList();
    }

    public List<PresupuestoReporteDTO> consultaFinancieroPorCodigoProyecto(String codigoProyecto) {
        var presupuestos = presupuestoPorTipoYCodigoProyecto(codigoProyecto, "FINANCIERO");
        var ids = presupuestos.stream().map(RepPresupuestoBase::getIdPresupuesto).toList();
        var gastos = repPresupuestoGastosService.agruparPorIdPresupuestos(ids);

        return presupuestos
                .stream()
                .map(rep -> this.obtenerPresupuestoReporteDTO(
                        rep,
                        gastos.getOrDefault(rep.getIdPresupuesto(), List.of()),
                        null
                ))
                .toList();
    }

    public PresupuestoReporteDTO obtenerPresupuestoReporteDTO(RepPresupuestoBase presupuestoBase,
                                                              List<GastoReporteDTO> gastos,
                                                              List<HorasAsignadasReporteDTO> horas){
        var resumen = obtenerResumenPresupuesto(presupuestoBase);
        return new PresupuestoReporteDTO(
                presupuestoBase.getIdPresupuesto(),
                presupuestoBase.getCategoriaPresupuesto(),
                presupuestoBase.getDescripcionPresupuesto(),
                presupuestoBase.getTipoPresupuesto(),
                presupuestoBase.getFechaAsignacion(),
                presupuestoBase.getFuenteFinanciamiento(),
                presupuestoBase.getCantidadHoras(),
                presupuestoBase.getCantidadMeses(),
                presupuestoBase.getMontoAsignado(),
                resumen,
                gastos,
                horas
        );
    }

    PresupuestoResumenReporteDTO obtenerResumenPresupuesto(RepPresupuestoBase presupuestoBase){
        if(presupuestoBase.getTipoPresupuesto().equalsIgnoreCase("HORAS"))
            return new PresupuestoResumenReporteDTO(
                    presupuestoBase.getHorasAsignadas(),
                    presupuestoBase.getHorasUsadas(),
                    presupuestoBase.getHorasDisponibles(),
                    presupuestoBase.getCantidadRegistrosHoras()
            );
        else // FINANCIERO
            return new PresupuestoResumenReporteDTO(
                    presupuestoBase.getMontoAsignado(),
                    presupuestoBase.getTotalGastado(),
                    presupuestoBase.getMontoDisponible(),
                    presupuestoBase.getCantidadGastos()
            );
    }

    public PresupuestoDatosDTO obtenerPresupuestoDatosDTO(RepPresupuestoBase presupuestoBase){
        return new PresupuestoDatosDTO(
              presupuestoBase.getIdPresupuesto(),
              presupuestoBase.getCategoriaPresupuesto(),
                presupuestoBase.getDescripcionPresupuesto()
        );
    }

    /**
     * Obtener presupuestos (vista) agrupados por idProyecto.
     */
    public Map<Integer, List<RepPresupuestoBase>> obtenerPorProyectos(List<Integer> ids) {
        if (ids == null || ids.isEmpty()) return Map.of();

        List<RepPresupuestoBase> filas = repo.findByIdProyectoIn(ids);

        return filas.stream()
                .collect(Collectors.groupingBy(RepPresupuestoBase::getIdProyecto));
    }

    public List<RepPresupuestoBase> obtenerPorProyecto(Integer idProyecto) {
        if (idProyecto == null) return List.of();
        return repo.findByIdProyecto(idProyecto); // o findByIdProyecto si existe
    }
}


package org.example.backend_cices_system.service.export;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.dto.export.*;
import org.example.backend_cices_system.dto.filter.PresupuestoFiltroDTO;
import org.example.backend_cices_system.service.view.RepPresupuestoBaseService;
import org.example.backend_cices_system.service.view.RepPresupuestoGastosService;
import org.example.backend_cices_system.service.view.RepPresupuestoHorasService;
import org.example.backend_cices_system.model.view.RepPresupuestoBase;
import org.example.backend_cices_system.dto.filter.ProyectoFiltroDTO;
import org.example.backend_cices_system.service.view.RepProyectoBaseService;
import org.example.backend_cices_system.model.view.RepProyectoBase;
import org.example.backend_cices_system.service.auditory.GastoBitService;
import org.example.backend_cices_system.service.auditory.PresupuestoBitService;
import org.example.backend_cices_system.dto.entity.ProyectoFechasDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PresupuestoReporteOrquestador {

    private final RepProyectoBaseService proyectoService;
    private final RepPresupuestoBaseService presupuestoService;
    private final RepPresupuestoGastosService gastosService;
    private final RepPresupuestoHorasService horasService;
    private final PresupuestoBitService presupuestoBitService;
    private final GastoBitService gastoBitService;

    // ════════════════════════════════════════════════════════════════════════
    // LISTADO PAGINADO (liviano, sin bitácoras)
    // ════════════════════════════════════════════════════════════════════════

    public Page<ReportePresupuestosListadoDTO> paginado(
            ProyectoFiltroDTO filtro,
            PresupuestoFiltroDTO filtroPresupuesto,
            Pageable pageable,
            int limitePresupuestos
    ) {
        Page<RepProyectoBase> pagina =
                proyectoService.obtenerPaginaFiltrada(filtro, pageable);

        if (pagina.isEmpty()) return Page.empty(pageable);

        List<Integer> idsProyecto = pagina.getContent().stream()
                .map(RepProyectoBase::getIdProyecto)
                .toList();

        // batch: todos los presupuestos de los proyectos de esta página
        Map<Integer, List<RepPresupuestoBase>> porProyecto =
                tieneFiltroPresupuesto(filtroPresupuesto)
                        ? presupuestoService.obtenerPorProyectosConFiltro(idsProyecto, filtroPresupuesto)
                        : presupuestoService.obtenerPorProyectos(idsProyecto);

        return pagina.map(p -> {
            List<RepPresupuestoBase> lista =
                    porProyecto.getOrDefault(p.getIdProyecto(), List.of());

            int total = lista.size();
            List<RepPresupuestoBase> limitados = lista.stream()
                    .limit(limitePresupuestos).toList();
            int restantes = Math.max(0, total - limitePresupuestos);

            return new ReportePresupuestosListadoDTO(
                    toProyectoFechasDTO(p),
                    limitados.stream().map(rep ->
                            presupuestoService.obtenerPresupuestoReporteDTO(rep, null, null)
                    ).toList(),
                    total,
                    restantes
            );
        });
    }

    // ════════════════════════════════════════════════════════════════════════
    // EXPORTACIÓN COMPLETA (con gastos, horas y bitácoras)
    // ════════════════════════════════════════════════════════════════════════

    public List<ReportePresupuestosExportDTO> generarCompleto(
            ProyectoFiltroDTO filtro,
            PresupuestoFiltroDTO filtroPresupuesto
    ) {
        List<Integer> idsProyecto = proyectoService.buscarIdsPorFiltros(filtro);
        if (idsProyecto.isEmpty()) return List.of();

        List<RepProyectoBase> proyectos = proyectoService.buscarPorIds(idsProyecto);

        Map<Integer, List<RepPresupuestoBase>> presupuestosPorProyecto =
                tieneFiltroPresupuesto(filtroPresupuesto)
                        ? presupuestoService.obtenerPorProyectosConFiltro(idsProyecto, filtroPresupuesto)
                        : presupuestoService.obtenerPorProyectos(idsProyecto);

        // IDs de todos los presupuestos en el lote
        List<Integer> idsPresupuesto = presupuestosPorProyecto.values().stream()
                .flatMap(List::stream)
                .map(RepPresupuestoBase::getIdPresupuesto)
                .distinct()
                .toList();

        // Gastos y horas (agrupados por idPresupuesto)
        Map<Integer, List<GastoReporteDTO>> gastosPorPresupuesto =
                gastosService.obtenerPorProyectos(idsProyecto);

        Map<Integer, List<HorasAsignadasReporteDTO>> horasPorPresupuesto =
                horasService.obtenerPorProyectosAgrupadoPorPresupuesto(idsProyecto);

        // Bitácoras de presupuesto (agrupadas por idPresupuesto)
        Map<Integer, List<BitacoraPresupuestoReporteDTO>> bitPresupuestoPorId =
                presupuestoBitService.obtenerPorPresupuestos(idsPresupuesto);

        // Bitácoras de gasto (agrupadas por idPresupuesto)
        Map<Integer, List<BitacoraGastoReporteDTO>> bitGastoPorPresupuesto =
                gastoBitService.obtenerPorPresupuestos(idsPresupuesto);

        return proyectos.stream().map(p -> {
            List<RepPresupuestoBase> presupuestos =
                    presupuestosPorProyecto.getOrDefault(p.getIdProyecto(), List.of());

            List<PresupuestoConBitacorasReporteDTO> conBitacoras =
                    presupuestos.stream().map(pb -> ensamblarConBitacoras(
                            pb,
                            gastosPorPresupuesto,
                            horasPorPresupuesto,
                            bitPresupuestoPorId,
                            bitGastoPorPresupuesto
                    )).toList();

            return new ReportePresupuestosExportDTO(toProyectoFechasDTO(p), conBitacoras);
        }).toList();
    }

    // ════════════════════════════════════════════════════════════════════════
    // MAPEO INTERNO
    // ════════════════════════════════════════════════════════════════════════

    private PresupuestoConBitacorasReporteDTO ensamblarConBitacoras(
            RepPresupuestoBase pb,
            Map<Integer, List<GastoReporteDTO>> gastosPorPresupuesto,
            Map<Integer, List<HorasAsignadasReporteDTO>> horasPorPresupuesto,
            Map<Integer, List<BitacoraPresupuestoReporteDTO>> bitPresupuestoPorId,
            Map<Integer, List<BitacoraGastoReporteDTO>> bitGastoPorPresupuesto
    ) {
        Integer id = pb.getIdPresupuesto();

        PresupuestoReporteDTO base = presupuestoService.obtenerPresupuestoReporteDTO(
                pb,
                gastosPorPresupuesto.getOrDefault(id, List.of()),
                horasPorPresupuesto.getOrDefault(id, List.of())
        );

        List<BitacoraPresupuestoReporteDTO> cambiosPresupuesto =
                bitPresupuestoPorId.getOrDefault(id, List.of());

        List<BitacoraGastoReporteDTO> cambiosGasto =
                bitGastoPorPresupuesto.getOrDefault(id, List.of());

        return new PresupuestoConBitacorasReporteDTO(base, cambiosPresupuesto, cambiosGasto);
    }

    private boolean tieneFiltroPresupuesto(PresupuestoFiltroDTO f) {
        if (f == null) return false;
        return (f.busqueda()              != null && !f.busqueda().isBlank())
                || (f.tipoPresupuesto()       != null && !f.tipoPresupuesto().isBlank())
                || (f.codigoProyecto()        != null && !f.codigoProyecto().isBlank())
                || (f.fuentesFinanciamiento() != null && !f.fuentesFinanciamiento().isEmpty())
                || (f.categorias()            != null && !f.categorias().isEmpty())
                ||  f.anioDesde()            != null
                ||  f.anioHasta()            != null;
    }

    private ProyectoFechasDTO toProyectoFechasDTO(RepProyectoBase p) {
        return new ProyectoFechasDTO(
                p.getCodigoProyecto(),
                p.getNombreProyecto(),
                p.getFechaInicio(),
                p.getFechaFinalizacion()
        );
    }

}
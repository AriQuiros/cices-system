package org.example.backend_cices_system.service.export;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.service.view.RepPresupuestoHorasService;
import org.example.backend_cices_system.dto.filter.ProyectoFiltroDTO;
import org.example.backend_cices_system.service.view.RepInvestigadorProyectoService;
import org.example.backend_cices_system.service.view.RepProyectoBaseService;
import org.example.backend_cices_system.model.view.RepProyectoBase;
import org.example.backend_cices_system.dto.export.HorasAsignadasReporteDTO;
import org.example.backend_cices_system.dto.export.InvestigadorReporteDTO;
import org.example.backend_cices_system.dto.export.ReporteParticipantesDTO;
import org.example.backend_cices_system.dto.entity.ProyectoFechasDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ParticipantesReporteOrquestador {

    private final RepProyectoBaseService proyectoService;
    private final RepPresupuestoHorasService horasService;
    private final RepInvestigadorProyectoService investigadorService;

    // ════════════════════════════════════════════════════════
    // PAGINADO
    // ════════════════════════════════════════════════════════

    public Page<ReporteParticipantesDTO> paginado(
            ProyectoFiltroDTO filtro,
            Pageable pageable,
            int limiteParticipantes
    ) {
        Page<RepProyectoBase> pagina = proyectoService.obtenerPaginaFiltrada(filtro, pageable);

        if (pagina.isEmpty()) return Page.empty(pageable);

        List<Integer> ids = pagina.getContent()
                .stream()
                .map(RepProyectoBase::getIdProyecto)
                .toList();

        Map<Integer, List<InvestigadorReporteDTO>> investigadoresMap =
                investigadorService.obtenerPorProyectos(ids);

        Map<Integer, HorasAsignadasReporteDTO> horasMap =
                horasService.obtenerHorasPorInvestigador(ids);

        return pagina.map(p -> construirReporte(
                p,
                investigadoresMap,
                horasMap,
                limiteParticipantes
        ));
    }

    // ════════════════════════════════════════════════════════
    // COMPLETO
    // ════════════════════════════════════════════════════════

    public List<ReporteParticipantesDTO> generarCompleto(ProyectoFiltroDTO filtro) {

        List<Integer> ids = proyectoService.buscarIdsPorFiltros(filtro);

        if (ids.isEmpty()) return List.of();

        List<RepProyectoBase> proyectos = proyectoService.buscarPorIds(ids);

        Map<Integer, List<InvestigadorReporteDTO>> investigadoresMap =
                investigadorService.obtenerPorProyectos(ids);

        Map<Integer, HorasAsignadasReporteDTO> horasMap =
                horasService.obtenerHorasPorInvestigador(ids);

        return proyectos.stream()
                .map(p -> construirReporte(p, investigadoresMap, horasMap, null))
                .toList();
    }

    // ════════════════════════════════════════════════════════
    // MÉTODOS AUXILIARES (LIMPIEZA)
    // ════════════════════════════════════════════════════════

    private ReporteParticipantesDTO construirReporte(
            RepProyectoBase proyecto,
            Map<Integer, List<InvestigadorReporteDTO>> investigadoresMap,
            Map<Integer, HorasAsignadasReporteDTO> horasMap,
            Integer limite
    ) {
        List<HorasAsignadasReporteDTO> lista = construirParticipantes(
                investigadoresMap.getOrDefault(proyecto.getIdProyecto(), List.of()),
                horasMap
        );

        int total = lista.size();

        List<HorasAsignadasReporteDTO> limitados =
                (limite != null)
                        ? lista.stream().limit(limite).toList()
                        : lista;

        int restantes =
                (limite != null)
                        ? Math.max(0, total - limite)
                        : 0;

        return new ReporteParticipantesDTO(
                construirProyectoDTO(proyecto),
                limitados,
                total,
                restantes
        );
    }

    private List<HorasAsignadasReporteDTO> construirParticipantes(
            List<InvestigadorReporteDTO> investigadores,
            Map<Integer, HorasAsignadasReporteDTO> horasMap
    ) {
        return investigadores.stream()
                .map(inv -> construirParticipante(inv, horasMap))
                .toList();
    }

    private HorasAsignadasReporteDTO construirParticipante(
            InvestigadorReporteDTO inv,
            Map<Integer, HorasAsignadasReporteDTO> horasMap
    ) {
        HorasAsignadasReporteDTO horas =
                horasMap.get(inv.id());

        return new HorasAsignadasReporteDTO(
                horas != null ? horas.id() : null,
                inv.id(),
                inv.nombreCompleto(),
                horas != null ? horas.modalidad() : null,
                inv.rolProyecto(),
                inv.fechaInicio(),
                inv.fechaFin(),
                horas != null ? horas.tiempo() : null,
                horas != null ? horas.horasMes() : null,
                horas != null ? horas.meses() : null,
                horas != null ? horas.totalHorasAsignadas() : null
        );
    }

    private ProyectoFechasDTO construirProyectoDTO(RepProyectoBase p) {
        return new ProyectoFechasDTO(
                p.getCodigoProyecto(),
                p.getNombreProyecto(),
                p.getFechaInicio(),
                p.getFechaFinalizacion()
        );
    }
}
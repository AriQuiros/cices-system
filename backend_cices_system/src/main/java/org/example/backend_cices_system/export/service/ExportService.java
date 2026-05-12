package org.example.backend_cices_system.export.service;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.consult.investigador.dto.FormacionDTO;
import org.example.backend_cices_system.consult.investigador.dto.CertificacionFiltroDTO;
import org.example.backend_cices_system.consult.presupuesto.dto.PresupuestoFiltroDTO;
import org.example.backend_cices_system.consult.proyecto.dto.ProyectoFiltroDTO;
import org.example.backend_cices_system.consult.investigador.service.RepInvestigadorCertificacionesService;
import org.example.backend_cices_system.export.builder.CertificacionesReportBuilder;
import org.example.backend_cices_system.export.builder.ParticipantesReportBuilder;
import org.example.backend_cices_system.export.builder.PresupuestosReportBuilder;
import org.example.backend_cices_system.export.builder.ProyectosReportBuilder;
import org.example.backend_cices_system.export.dto.ProyectoReporteDTO;
import org.example.backend_cices_system.export.dto.ReporteParticipantesDTO;
import org.example.backend_cices_system.export.dto.ReportePresupuestosExportDTO;
import org.example.backend_cices_system.export.dto.ReportePresupuestosListadoDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * ExportService: punto de entrada HTTP → reporte binario (PDF/Word/Excel).
 *
 * Responsabilidad única: recibir parámetros del controller,
 * delegar la obtención de datos al orquestador y la serialización
 * al DocumentService.
 *
 * NO hace queries directas. NO contiene lógica de negocio.
 */
@Service
@RequiredArgsConstructor
public class ExportService {

    private final DocumentService documentService;

    private final CertificacionesReportBuilder certificacionesReportBuilder;
    private final ProyectosReportBuilder proyectosReportBuilder;
    private final ParticipantesReportBuilder participantesReportBuilder;
    private final PresupuestosReportBuilder presupuestosReportBuilder;

    private final RepInvestigadorCertificacionesService repInvestigadorCertificacionesService;

    private final ProyectoReporteOrquestador proyectoReporteOrquestador;
    private final ParticipantesReporteOrquestador participantesReporteOrquestador;
    private final PresupuestoReporteOrquestador presupuestoReporteOrquestador;

    // ════════════════════════════════════════════════════════════════════════
    // CERTIFICACIONES
    // ════════════════════════════════════════════════════════════════════════

    public ResponseEntity<byte[]> generarReporteCertificaciones(
            CertificacionFiltroDTO filtro,
            String formato
    ) {
        List<FormacionDTO> data = repInvestigadorCertificacionesService.filtrarCertificaciones(filtro);

        return documentService.generarResponse(
                certificacionesReportBuilder,
                data,
                formato,
                "reporte_certificaciones"
        );
    }

    // ════════════════════════════════════════════════════════════════════════
    // PROYECTOS — reporte por filtros (múltiples proyectos)
    // ════════════════════════════════════════════════════════════════════════

    public ResponseEntity<byte[]> generarReporteProyectos(
            ProyectoFiltroDTO filtro,
            String formato
    ) {
        List<ProyectoReporteDTO> data = proyectoReporteOrquestador.ensamblarConFiltros(filtro);

        return documentService.generarResponse(
                proyectosReportBuilder,
                data,
                formato,
                "reporte_proyectos"
        );
    }

    // ════════════════════════════════════════════════════════════════════════
    // PARTICIPANTES
    // ════════════════════════════════════════════════════════════════════════

    public Page<ReporteParticipantesDTO> paginadoParticipantes(ProyectoFiltroDTO filtro, Pageable pageable, int limte){
        return participantesReporteOrquestador.paginado(filtro,pageable, limte);
    }

    public ResponseEntity<byte[]> generarReporteParticipantes(
            ProyectoFiltroDTO filtro,
            String formato
    ) {
        List<ReporteParticipantesDTO> data = participantesReporteOrquestador.generarCompleto(filtro);
        return documentService.generarResponse(
                participantesReportBuilder,
                data,
                formato,
                "reporte_participantes"
        );
    }

    // ════════════════════════════════════════════════════════════════════════
    // PRESUPUESTOS
    // ════════════════════════════════════════════════════════════════════════

    public Page<ReportePresupuestosListadoDTO> paginadoPresupuestos(
            ProyectoFiltroDTO filtroProyecto,
            PresupuestoFiltroDTO filtroPresupuesto,
            Pageable pageable,
            int limite
    ) {
        return presupuestoReporteOrquestador.paginado(
                filtroProyecto, filtroPresupuesto, pageable, limite);
    }

    public ResponseEntity<byte[]> generarReportePresupuestos(
            ProyectoFiltroDTO filtroProyecto,
            PresupuestoFiltroDTO filtroPresupuesto,
            String formato
    ) {
        List<ReportePresupuestosExportDTO> data =
                presupuestoReporteOrquestador.generarCompleto(filtroProyecto, filtroPresupuesto);
        return documentService.generarResponse(
                presupuestosReportBuilder, data, formato, "reporte_presupuestos");
    }

}

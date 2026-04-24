package org.example.backend_cices_system.export.service;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.consult.investigador.dto.FormacionDTO;
import org.example.backend_cices_system.consult.investigador.dto.CertificacionFiltroDTO;
import org.example.backend_cices_system.consult.proyecto.dto.ProyectoFiltroDTO;
import org.example.backend_cices_system.consult.investigador.service.RepInvestigadorCertificacionesService;
import org.example.backend_cices_system.export.builder.CertificacionesReportBuilder;
import org.example.backend_cices_system.export.builder.ProyectosReportBuilder;
import org.example.backend_cices_system.export.dto.ProyectoReporteDTO;
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

    private final RepInvestigadorCertificacionesService repInvestigadorCertificacionesService;
    private final ProyectoReporteOrquestador orquestador;

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
        List<ProyectoReporteDTO> data = orquestador.ensamblarConFiltros(filtro);

        return documentService.generarResponse(
                proyectosReportBuilder,
                data,
                formato,
                "reporte_proyectos"
        );
    }

    // ════════════════════════════════════════════════════════════════════════
    // PROYECTOS — reporte por IDs explícitos
    // ════════════════════════════════════════════════════════════════════════

    public ResponseEntity<byte[]> generarReporteProyectosPorIds(
            List<Integer> ids,
            String formato
    ) {
        List<ProyectoReporteDTO> data = orquestador.ensamblar(ids);

        return documentService.generarResponse(
                proyectosReportBuilder,
                data,
                formato,
                "reporte_proyectos"
        );
    }

}

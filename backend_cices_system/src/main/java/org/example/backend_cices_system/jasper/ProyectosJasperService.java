package org.example.backend_cices_system.jasper;

import org.example.backend_cices_system.report.dto.ProyectoReporteDTO;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Servicio específico para el reporte de Proyectos.
 *
 * Patrón idéntico a CertificacionesJasperService:
 *  - solo conoce la ruta del .jrxml y el título
 *  - delega 100% a JasperBaseService
 */
@Service
public class ProyectosJasperService {

    private static final String JRXML_PATH     = "reports/proyectos/proyectos_report.jrxml";
    private static final String TITULO_REPORTE = "Reporte de Proyectos de Investigación";

    private final JasperBaseService jasperBaseService;

    public ProyectosJasperService(JasperBaseService jasperBaseService) {
        this.jasperBaseService = jasperBaseService;
    }

    /**
     * Genera el reporte de proyectos en el formato indicado.
     *
     * @param datos   lista de ProyectoReporteDTO ya filtrada
     * @param formato "pdf" | "xlsx" | "docx"
     * @return bytes del archivo
     */
    public byte[] generar(List<ProyectoReporteDTO> datos, String formato) {
        System.out.println(formato);
        return jasperBaseService.generarReporte(
                JRXML_PATH,
                datos,
                TITULO_REPORTE,
                formato
        );
    }
}
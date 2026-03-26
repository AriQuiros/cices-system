package org.example.backend_cices_system.jasper;

import org.example.backend_cices_system.report.dto.FormacionDTO;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Servicio específico para el reporte de Certificaciones.
 *
 * Delegación total a JasperBaseService — este servicio solo conoce:
 *  - La ruta de su .jrxml
 *  - El título del reporte
 *  - Cualquier parámetro adicional propio de este reporte
 *
 * Para agregar un nuevo reporte al sistema, basta con crear una clase
 * similar a esta e inyectar JasperBaseService.
 */
@Service
public class CertificacionesJasperService {

    private static final String JRXML_PATH    = "reports/certificaciones/certificaciones_report.jrxml";
    private static final String TITULO_REPORTE = "Reporte de Certificaciones de Investigadores";

    private final JasperBaseService jasperBaseService;

    public CertificacionesJasperService(JasperBaseService jasperBaseService) {
        this.jasperBaseService = jasperBaseService;
    }

    /**
     * Genera el reporte de certificaciones en el formato indicado.
     *
     * @param datos   lista de FormacionDTO ya filtrada y ordenada
     * @param formato "pdf" | "xlsx" | "docx"
     * @return bytes del archivo
     */
    public byte[] generar(List<FormacionDTO> datos, String formato) {
        return jasperBaseService.generarReporte(
                JRXML_PATH,
                datos,
                TITULO_REPORTE,
                formato
        );
    }
}
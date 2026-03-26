package org.example.backend_cices_system.jasper;

import net.sf.jasperreports.engine.*;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import net.sf.jasperreports.engine.export.ooxml.JRDocxExporter;
import net.sf.jasperreports.engine.export.ooxml.JRXlsxExporter;
import net.sf.jasperreports.export.*;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

/**
 * Servicio base reutilizable para todos los reportes JasperReports del sistema.
 *
 * Responsabilidades:
 *  - Compilar y llenar reportes .jrxml
 *  - Inyectar parámetros comunes (encabezado, pie de página, fecha)
 *  - Exportar a PDF, Excel (.xlsx) y Word (.docx)
 *
 * Uso: los servicios específicos de cada reporte extienden o inyectan este componente,
 * y solo necesitan proveer la ruta del .jrxml y los datos específicos.
 */

@Component
public class JasperBaseService {
    /** Nombre del sistema/institución que aparece en el encabezado */
    private static final String PARAM_SISTEMA      = "SISTEMA_NOMBRE";

    /** Subtítulo o nombre del reporte específico */
    private static final String PARAM_TITULO       = "REPORTE_TITULO";

    /** Fecha de generación (formateada) */
    private static final String PARAM_FECHA        = "FECHA_GENERACION";

    /** Texto del pie de página izquierdo (ej: "Confidencial") */
    private static final String PARAM_PIE_TEXTO    = "PIE_TEXTO";

    /** Logo de la institución (ruta classpath o null para omitir) */
    private static final String PARAM_LOGO_PATH    = "LOGO_PATH";

    // Valor por defecto del nombre del sistema
    private static final String SISTEMA_NOMBRE_DEFAULT = "CICES — Sistema de Gestión";
    private static final String PIE_TEXTO_DEFAULT      = "Documento generado automáticamente. No requiere firma.";

    /**
     * Genera un reporte en el formato indicado.
     *
     * @param jrxmlPath  ruta relativa al classpath, ej: "reports/certificaciones/certificaciones_report.jrxml"
     * @param datos      colección de beans (DTOs) que alimentan el reporte
     * @param titulo     título visible en el encabezado del reporte
     * @param params     parámetros adicionales específicos del reporte (puede ser vacío)
     * @param formato    "pdf" | "xlsx" | "docx"
     * @return           bytes del archivo generado
     */
    public byte[] generarReporte(
            String jrxmlPath,
            Collection<?> datos,
            String titulo,
            Map<String, Object> params,
            String formato
    ) {
        try {
            JasperPrint print = compilarYLlenar(jrxmlPath, datos, titulo, params);
            return exportar(print, formato);
        } catch (Exception e) {
            throw new RuntimeException("Error generando reporte [" + formato + "]: " + e.getMessage(), e);
        }
    }

    // Sobrecargar sin parámetros extra para simplificar casos básicos
    public byte[] generarReporte(
            String jrxmlPath,
            Collection<?> datos,
            String titulo,
            String formato
    ) {
        return generarReporte(jrxmlPath, datos, titulo, new HashMap<>(), formato);
    }
    /**
     * Compila el .jrxml (o usa el .jasper cacheado si existe),
     * inyecta parámetros comunes + específicos y llena el reporte con los datos.
     */
    private JasperPrint compilarYLlenar(
            String jrxmlPath,
            Collection<?> datos,
            String titulo,
            Map<String, Object> paramsExtra
    ) throws Exception {

        // Compilar desde classpath
        InputStream stream = new ClassPathResource(jrxmlPath).getInputStream();
        JasperReport jasperReport = JasperCompileManager.compileReport(stream);

        // Parámetros comunes (encabezado / pie)
        Map<String, Object> params = parametrosComunes(titulo);

        // Mezclar con parámetros específicos del reporte
        // Los params específicos tienen prioridad si hay colisión de claves
        params.putAll(paramsExtra);

        // Data source desde la colección de DTOs
        JRBeanCollectionDataSource dataSource = new JRBeanCollectionDataSource(datos);

        return JasperFillManager.fillReport(jasperReport, params, dataSource);
    }

    /**
     * Construye el mapa de parámetros comunes que se inyectan en todos los reportes.
     */
    private Map<String, Object> parametrosComunes(String titulo) {
        Map<String, Object> params = new HashMap<>();

        params.put(PARAM_SISTEMA,   SISTEMA_NOMBRE_DEFAULT);
        params.put(PARAM_TITULO,    titulo);
        params.put(PARAM_FECHA,     LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));
        params.put(PARAM_PIE_TEXTO, PIE_TEXTO_DEFAULT);

        // Logo: si existe en classpath lo incluimos, si no, null (el .jrxml debe manejarlo)
        String logoPath = resolverLogoPath();
        params.put(PARAM_LOGO_PATH, logoPath);

        return params;
    }

    /**
     * Intenta resolver la ruta del logo desde el classpath.
     * Retorna null si no existe (el .jrxml ocultará el campo).
     */
    private String resolverLogoPath() {
        try {
            ClassPathResource logo = new ClassPathResource("reports/assets/logo.png");
            if (logo.exists()) {
                return logo.getURL().toString();
            }
        } catch (Exception ignored) {}
        return null;
    }

    /**
     * Exporta un JasperPrint al formato indicado.
     */
    private byte[] exportar(JasperPrint print, String formato) throws Exception {
        return switch (formato.toLowerCase()) {
            case "pdf"  -> exportarPDF(print);
            case "xlsx" -> exportarExcel(print);
            case "docx" -> exportarWord(print);
            default     -> throw new IllegalArgumentException("Formato no soportado: " + formato);
        };
    }

    private byte[] exportarPDF(JasperPrint print) throws JRException {
        return JasperExportManager.exportReportToPdf(print);
    }

    private byte[] exportarExcel(JasperPrint print) throws JRException {
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        JRXlsxExporter exporter = new JRXlsxExporter();
        exporter.setExporterInput(new SimpleExporterInput(print));
        exporter.setExporterOutput(new SimpleOutputStreamExporterOutput(out));

        SimpleXlsxReportConfiguration config = new SimpleXlsxReportConfiguration();
        config.setCollapseRowSpan(true);
        config.setIgnoreGraphics(true);

        config.setOnePagePerSheet(false);       // todos los datos en una hoja
        config.setRemoveEmptySpaceBetweenRows(true);
        config.setDetectCellType(true);         // respeta tipos numéricos y de fecha
        config.setWhitePageBackground(false);

        exporter.setConfiguration(config);

        exporter.exportReport();
        return out.toByteArray();
    }

    private byte[] exportarWord(JasperPrint print) throws JRException {
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        JRDocxExporter exporter = new JRDocxExporter();
        exporter.setExporterInput(new SimpleExporterInput(print));
        exporter.setExporterOutput(new SimpleOutputStreamExporterOutput(out));

        // Configuración básica Word
        SimpleDocxReportConfiguration config = new SimpleDocxReportConfiguration();
        config.setFramesAsNestedTables(false);
        exporter.setConfiguration(config);

        exporter.exportReport();
        return out.toByteArray();
    }
}
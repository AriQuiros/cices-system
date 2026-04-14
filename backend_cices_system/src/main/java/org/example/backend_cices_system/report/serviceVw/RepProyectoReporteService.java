package org.example.backend_cices_system.report.serviceVw;

import org.example.backend_cices_system.jasper.ProyectosJasperService;
import org.example.backend_cices_system.dto.ProyectoDatosDTO;
import org.example.backend_cices_system.report.dto.ProyectoFiltroDTO;
import org.example.backend_cices_system.report.dto.ProyectoReporteDTO;
import org.example.backend_cices_system.service.ProyectoService;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RepProyectoReporteService {

    private final ProyectoService        proyectoService;
    private final ProyectosJasperService jasperService;

    public RepProyectoReporteService(
            ProyectoService proyectoService,
            ProyectosJasperService jasperService
    ) {
        this.proyectoService = proyectoService;
        this.jasperService   = jasperService;
    }

    // ------------------------------------------------------------------
    // Exportación (PDF / XLSX / DOCX)
    // ------------------------------------------------------------------

    /**
     * Flujo completo de generación del reporte:
     *  1. Recibe filtros del controller
     *  2. Llama a buscarConFiltros con Pageable "sin límite" (Integer.MAX_VALUE)
     *  3. Convierte Page<ProyectoDatosDTO> → List<ProyectoReporteDTO>
     *  4. Pasa la lista a ProyectosJasperService (que llena el JRXML)
     *  5. Recibe bytes y los envuelve en ResponseEntity con headers HTTP
     */
    public ResponseEntity<byte[]> generarReporte(
            ProyectoFiltroDTO filtro,
            String formato
    ) {
        // Paso 2 y 3: obtener todos los registros (sin paginación)
        List<ProyectoReporteDTO> data = obtenerParaReporte(filtro);

        // Paso 4 y 5: generar bytes y responder
        byte[] archivo = jasperService.generar(data, formato);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=proyectos." + formato)
                .contentType(contentType(formato))
                .body(archivo);
    }

    // ------------------------------------------------------------------
    // Helpers privados
    // ------------------------------------------------------------------

    /**
     * Obtiene TODOS los proyectos que cumplen los filtros (sin paginación).
     *
     * Patrón: se llama buscarConFiltros con un Pageable de tamaño máximo
     * y se extrae el contenido. No se duplica la lógica de filtros.
     */
    private List<ProyectoReporteDTO> obtenerParaReporte(ProyectoFiltroDTO filtro) {
        Pageable sinLimite = PageRequest.of(0, Integer.MAX_VALUE, sort(filtro.getOrdenFecha()));

        return proyectoService.buscarConFiltros(
                        filtro.getTexto(),
                        filtro.getEstado(),
                        filtro.getTipos(),
                        filtro.getLineas(),
                        filtro.getInstitucion(),
                        sinLimite
                )
                .getContent()          // Page → List<ProyectoDatosDTO>
                .stream()
                .map(this::toDTO)      // ProyectoDatosDTO → ProyectoReporteDTO
                .toList();
    }

    /** Convierte ProyectoDatosDTO (dominio) → ProyectoReporteDTO (Jasper bean) */
    private ProyectoReporteDTO toDTO(ProyectoDatosDTO p) {
        return new ProyectoReporteDTO(
                p.codigoProyecto(),
                p.nombreProyecto(),
                p.lineaInvestigacion(),
                p.tipoProyecto(),
                p.estado(),
                p.fechaInicio(),
                p.fechaFinalizacion()
        );
    }

    private Sort sort(String ordenFecha) {
        return Sort.by(
                "desc".equalsIgnoreCase(ordenFecha) ? Sort.Direction.DESC : Sort.Direction.ASC,
                "fechaInicio"
        );
    }

    private MediaType contentType(String formato) {
        return switch (formato.toLowerCase()) {
            case "pdf"  -> MediaType.APPLICATION_PDF;
            case "xlsx" -> MediaType.parseMediaType(
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            case "docx" -> MediaType.parseMediaType(
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
            default     -> MediaType.APPLICATION_OCTET_STREAM;
        };
    }
}
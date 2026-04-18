package org.example.backend_cices_system.report.serviceVw;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.dto.ProyectoDatosDTO;
import org.example.backend_cices_system.report.filter.ProyectoFiltroDTO;
import org.example.backend_cices_system.reportes.builder.ProyectosReportBuilder;
import org.example.backend_cices_system.reportes.service.DocumentService;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RepProyectoReporteService {

    private final RepProyectoBaseService repProyectoBaseService;
    private final DocumentService documentService;
    private final ProyectosReportBuilder proyectosReportBuilder;

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
        List<ProyectoDatosDTO> data = obtenerParaReporte(filtro);

        return documentService.generarResponse(
                proyectosReportBuilder,
                data,
                formato,
                "proyectos_reportes"
        );
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
    private List<ProyectoDatosDTO> obtenerParaReporte(ProyectoFiltroDTO filtro) {
        Pageable sinLimite = PageRequest.of(0, Integer.MAX_VALUE, sort(filtro.ordenFecha()));

        return repProyectoBaseService.buscarConFiltros(
                        filtro.texto(),
                        filtro.estado(),
                        filtro.tipos(),
                        filtro.lineas(),
                        sinLimite
                )
                .getContent()          // Page → List<ProyectoDatosDTO>
                .stream().toList();
    }


    private Sort sort(String ordenFecha) {
        return Sort.by(
                "desc".equalsIgnoreCase(ordenFecha) ? Sort.Direction.DESC : Sort.Direction.ASC,
                "fechaInicio"
        );
    }

}
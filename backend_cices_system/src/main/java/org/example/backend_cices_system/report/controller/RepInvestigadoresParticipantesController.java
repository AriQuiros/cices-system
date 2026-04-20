package org.example.backend_cices_system.report.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.report.dto.RepInvestigadoresParticipantesDTO;
import org.example.backend_cices_system.report.dto.RepInvestigadoresParticipantesFiltroDTO;
import org.example.backend_cices_system.report.serviceVw.RepInvestigadoresParticipantesArchivoService;
import org.example.backend_cices_system.report.serviceVw.RepInvestigadoresParticipantesService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/consulta/investigadores-participantes")
@CrossOrigin(origins = "http://localhost:5173")
public class RepInvestigadoresParticipantesController {

    private final RepInvestigadoresParticipantesService reporteService;
    private final RepInvestigadoresParticipantesArchivoService archivoService;

    @GetMapping("/exportar")
    public ResponseEntity<byte[]> exportarReporte(
            @RequestParam(required = false) String codigoProyecto,
            @RequestParam(required = false) String nombreProyecto,
            @RequestParam(required = false) Long idTipoProyecto,
            @RequestParam(required = false) Long idEstadoProyecto,
            @RequestParam(required = false) String lineaInvestigacion,
            @RequestParam(defaultValue = "pdf") String formato,
            @RequestParam(required = false) String orden
    ) {
        RepInvestigadoresParticipantesFiltroDTO filtros = new RepInvestigadoresParticipantesFiltroDTO();
        filtros.setCodigoProyecto(codigoProyecto);
        filtros.setNombreProyecto(nombreProyecto);
        filtros.setIdTipoProyecto(idTipoProyecto);
        filtros.setIdEstadoProyecto(idEstadoProyecto);
        filtros.setLineaInvestigacion(lineaInvestigacion);
        filtros.setFormato(formato);
        filtros.setOrden(orden);

        List<RepInvestigadoresParticipantesDTO> datos =
                reporteService.obtenerDatosReporte(filtros);

        long totalInvestigadores =
                reporteService.obtenerTotalInvestigadores(datos);

        Map<String, Long> totalPorRol =
                reporteService.obtenerTotalPorRol(datos);

        Map<String, Long> totalPorProyecto =
                reporteService.obtenerTotalPorProyecto(datos);

        byte[] archivo = archivoService.generarArchivo(
                formato,
                datos,
                totalInvestigadores,
                totalPorRol,
                totalPorProyecto
        );

        String extension = archivoService.obtenerExtension(formato);
        String contentType = archivoService.obtenerContentType(formato);

        String nombreArchivo = "reporte_investigadores_participantes." + extension;

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + nombreArchivo)
                .contentType(MediaType.parseMediaType(contentType))
                .body(archivo);
    }
}
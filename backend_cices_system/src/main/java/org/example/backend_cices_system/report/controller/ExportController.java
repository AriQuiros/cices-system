package org.example.backend_cices_system.report.controller;

import org.example.backend_cices_system.report.serviceVw.ExportService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;


@RestController
@RequestMapping("/api/export")
public class ExportController {

    private final ExportService exportService;

    public ExportController(ExportService exportService) {
        this.exportService = exportService;
    }

    @GetMapping("/{codigo}/academico")
    public Map<String, Object> exportarAcademico(@PathVariable String codigo) {
        return exportService.exportarProyectoAcademico(codigo);
    }

    @GetMapping("/{codigo}/financiero")
    public Map<String, Object> exportarFinanciero(@PathVariable String codigo) {
        return exportService.exportarProyectoFinanciero(codigo);
    }

    @GetMapping("/{codigo}/completo")
    public Map<String, Object> exportarCompleto(@PathVariable String codigo) {
        return exportService.exportarProyectoCompleto(codigo);
    }

}


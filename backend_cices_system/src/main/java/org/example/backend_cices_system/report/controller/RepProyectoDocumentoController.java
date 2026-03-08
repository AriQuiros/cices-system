package org.example.backend_cices_system.report.controller;

import org.example.backend_cices_system.report.serviceVw.RepProyectoDocumentoService;
import org.example.backend_cices_system.report.view.RepProyectoDocumento;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports/documentos")
public class RepProyectoDocumentoController {

    private final RepProyectoDocumentoService service;

    public RepProyectoDocumentoController(RepProyectoDocumentoService service) {
        this.service = service;
    }

    @GetMapping("/all")
    public List<RepProyectoDocumento> getAll() {
        return service.obtenerTodos();
    }

    @GetMapping("/codigo/{codigoProyecto}")
    public List<RepProyectoDocumento> getByCodigoProyecto(@PathVariable String codigoProyecto) {
        return service.buscarPorCodigoProyecto(codigoProyecto);
    }
}

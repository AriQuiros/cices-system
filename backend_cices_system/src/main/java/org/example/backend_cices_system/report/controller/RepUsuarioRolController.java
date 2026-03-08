package org.example.backend_cices_system.report.controller;

import org.example.backend_cices_system.report.serviceVw.RepUsuarioRolService;
import org.example.backend_cices_system.report.view.RepUsuarioRol;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports/usuarioRol")
public class RepUsuarioRolController {

    private final RepUsuarioRolService service;

    public RepUsuarioRolController(RepUsuarioRolService service) {
        this.service = service;
    }

    @GetMapping("/all")
    public List<RepUsuarioRol> getAll() {
        return service.obtenerTodos();
    }

    @GetMapping("/nombreUsuario/{nombreUsuario}")
    public List<RepUsuarioRol> getByNombreUsuario(@PathVariable String nombreUsuario) {
        return service.buscarPorNombreUsuario(nombreUsuario);
    }
}

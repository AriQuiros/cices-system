package org.example.backend_cices_system.report.controller;

import org.example.backend_cices_system.report.serviceVw.RepNotificacionesUsuarioService;
import org.example.backend_cices_system.report.view.RepNotificacionesUsuario;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports/notificaciones")
public class RepNotificacionesUsuarioController {

    private final RepNotificacionesUsuarioService service;

    public RepNotificacionesUsuarioController(RepNotificacionesUsuarioService service) {
        this.service = service;
    }

    @GetMapping("/all")
    public List<RepNotificacionesUsuario> getAll() {
        return service.obtenerTodos();
    }

    @GetMapping("/usuario/{nombreUsuario}")
    public List<RepNotificacionesUsuario> getByNombreUsuario(@PathVariable String nombreUsuario) {
        return service.buscarPorNombreUsuario(nombreUsuario);
    }
}

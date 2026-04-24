package org.example.backend_cices_system.presentation;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.shared.catalogo.CatalogoService;
import org.example.backend_cices_system.modules.notificacion.service.NotificacionSchedulerService;
import org.example.backend_cices_system.modules.proyecto.service.ProyectoService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/test")
public class TestController {

    private final NotificacionSchedulerService schedulerService;
    private final ProyectoService proyectoService;
    private final CatalogoService catalogoService;

    @GetMapping("/notificaciones")
    public String ejecutar() {
        schedulerService.ejecutarNotificaciones();
        return "Notificaciones ejecutadas";
    }
}
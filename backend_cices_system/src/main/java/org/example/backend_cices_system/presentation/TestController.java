package org.example.backend_cices_system.presentation;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.service.CatalogoService;
import org.example.backend_cices_system.service.NotificacionSchedulerService;
import org.example.backend_cices_system.service.ProyectoService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

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
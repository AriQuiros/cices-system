package org.example.backend_cices_system.presentation;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.service.NotificacionSchedulerService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/test")
public class TestController {

    private final NotificacionSchedulerService schedulerService;

    @GetMapping("/notificaciones")
    public String ejecutar() {
        schedulerService.ejecutarNotificaciones();
        return "Notificaciones ejecutadas";
    }
}
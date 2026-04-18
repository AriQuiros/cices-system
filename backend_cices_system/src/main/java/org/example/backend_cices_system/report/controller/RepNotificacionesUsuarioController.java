package org.example.backend_cices_system.report.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.report.dto.RepNotificacionDetalladaDTO;
import org.example.backend_cices_system.report.serviceVw.RepNotificacionesUsuarioService;
import org.example.backend_cices_system.service.NotificacionCambioService;
import org.example.backend_cices_system.report.view.RepNotificacionesUsuario;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.async.DeferredResult;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/reports/notificaciones")
public class RepNotificacionesUsuarioController {

    private final RepNotificacionesUsuarioService service;
    private final NotificacionCambioService notificacionCambioService;

    @GetMapping("/usuario/{nombreUsuario}")
    public List<RepNotificacionesUsuario> getByNombreUsuario(@PathVariable String nombreUsuario) {
        return service.buscarPorNombreUsuario(nombreUsuario);
    }

    @GetMapping("/usuario/{nombreUsuario}/detalladas")
    public List<RepNotificacionDetalladaDTO> getDetalladasByNombreUsuario(@PathVariable String nombreUsuario) {
        return service.buscarDetalladasPorNombreUsuario(nombreUsuario);
    }

    @GetMapping("/usuario/{nombreUsuario}/esperar-cambios")
    public DeferredResult<ResponseEntity<Void>> esperarCambios(@PathVariable String nombreUsuario) {
        return notificacionCambioService.esperarCambios(nombreUsuario);
    }

}

package org.example.backend_cices_system.report.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.logic.Usuario;
import org.example.backend_cices_system.report.dto.RepNotificacionDetalladaDTO;
import org.example.backend_cices_system.report.serviceVw.RepNotificacionesUsuarioService;
import org.example.backend_cices_system.service.NotificacionCambioService;
import org.example.backend_cices_system.report.view.RepNotificacionesUsuario;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.async.DeferredResult;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/consulta/notificaciones-usuario")
public class RepNotificacionesUsuarioController {

    private final RepNotificacionesUsuarioService service;
    private final NotificacionCambioService notificacionCambioService;

    @GetMapping("/listar")
    public List<RepNotificacionesUsuario> getByNombreUsuario(Authentication authentication) {
        Usuario usuario = (Usuario) authentication.getPrincipal();
        return service.buscarPorIdUsuario(usuario.getId());
    }

    @GetMapping("/detalladas")
    public List<RepNotificacionDetalladaDTO> getDetalladasByNombreUsuario(Authentication authentication) {
        Usuario usuario = (Usuario) authentication.getPrincipal();
        return service.buscarDetalladasPorNombreUsuario(usuario.getId());
    }

    @GetMapping("/esperar-cambios")
    public DeferredResult<ResponseEntity<Void>> esperarCambios(Authentication authentication) {
        Usuario usuario = (Usuario) authentication.getPrincipal();
        return notificacionCambioService.esperarCambios(usuario.getNombreUsuario());
    }

}

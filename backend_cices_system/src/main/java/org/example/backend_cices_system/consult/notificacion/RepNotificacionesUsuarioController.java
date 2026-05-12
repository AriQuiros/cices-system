package org.example.backend_cices_system.consult.notificacion;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.modules.notificacion.service.NotificacionCambioService;
import org.example.backend_cices_system.modules.usuario.model.Usuario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/consulta/notificaciones-usuario")
public class RepNotificacionesUsuarioController {

    private final RepNotificacionesUsuarioService service;
    private final NotificacionCambioService notificacionCambioService;

    @GetMapping("/listar")
    public Page<RepNotificacionesUsuario> listar(
            @ModelAttribute NotificacionFiltroDTO filtro,
            @PageableDefault(size = 10, page = 0) Pageable pageable,
            Authentication authentication
    ) {
        Usuario usuario = (Usuario) authentication.getPrincipal();
        return service.buscarConFiltro(usuario.getId(), filtro, pageable);
    }

    @GetMapping("/no-leidas/count")
    public long contarNoLeidas(Authentication authentication) {
        Usuario usuario = (Usuario) authentication.getPrincipal();
        return service.contarNoLeidas(usuario.getId());
    }

    @GetMapping(value = "/suscribir", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter suscribir(Authentication authentication) {
        Usuario usuario = (Usuario) authentication.getPrincipal();
        return notificacionCambioService.suscribir(usuario.getNombreUsuario());
    }
}
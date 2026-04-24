package org.example.backend_cices_system.modules.notificacion.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.modules.usuario.model.Usuario;
import org.example.backend_cices_system.modules.notificacion.service.NotificacionUsuarioService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.NoSuchElementException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/notificacion-usuario")
public class NotificacionUsuarioController {
    private final NotificacionUsuarioService service;

    @PutMapping("/leido/{idNotificacionUsuario}")
    public void marcarLeida(@PathVariable Integer idNotificacionUsuario,
                            Authentication authentication) {
        try {
            Usuario usuario = (Usuario) authentication.getPrincipal();
            service.marcarLeida(idNotificacionUsuario, usuario);
        } catch (NoSuchElementException ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
        }
    }

    @PutMapping("/no-leido/{idNotificacionUsuario}")
    public void marcarNoLeida(@PathVariable Integer idNotificacionUsuario,
                              Authentication authentication) {
        try {
            Usuario usuario = (Usuario) authentication.getPrincipal();
            service.marcarNoLeida(idNotificacionUsuario, usuario);
        } catch (NoSuchElementException ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
        }
    }

    @DeleteMapping("/eliminar/{idNotificacionUsuario}")
    public void eliminar(@PathVariable Integer idNotificacionUsuario,
                         Authentication authentication) {
        try {
            Usuario usuario = (Usuario) authentication.getPrincipal();
            service.eliminar(idNotificacionUsuario, usuario);
        } catch (NoSuchElementException ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
        }
    }
}

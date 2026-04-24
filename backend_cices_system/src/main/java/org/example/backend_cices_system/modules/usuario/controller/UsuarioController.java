package org.example.backend_cices_system.modules.usuario.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.modules.usuario.service.UsuarioService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    // Activar / desactivar usuario
    @PutMapping("/{id}/estado")
    public void cambiarEstado(@PathVariable Integer id, @RequestBody Map<String, Boolean> body) {
        boolean activo = body.get("activo");
        usuarioService.cambiarEstadoUsuario(id, activo);
    }

}
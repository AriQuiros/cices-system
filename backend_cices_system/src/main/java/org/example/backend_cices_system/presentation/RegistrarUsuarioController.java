package org.example.backend_cices_system.presentation;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.example.backend_cices_system.dto.UserInfo;
import org.example.backend_cices_system.service.AuthService;
import org.example.backend_cices_system.dto.UsuarioRegistroDTO;
@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class RegistrarUsuarioController {

    private final AuthService authService;

    public RegistrarUsuarioController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/registro")
    public ResponseEntity<?> registrarUsuario(@RequestBody UsuarioRegistroDTO usuario) {
        try {
            authService.registrar(usuario);
            return ResponseEntity.ok().body("Usuario registrado correctamente");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al registrar usuario: " + e.getMessage());
        }
    }
}
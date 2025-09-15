package org.example.backend_cices_system.presentation;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
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
            // Verifica si el error es por restricción única de identificación
            String msg = e.getMessage();
            if (msg != null) {
                String lowerMsg = msg.toLowerCase();
                // Identificación
                if (msg.contains("EMPLEADO_IDENTIFICACION_UK") || lowerMsg.contains("identificacion")||msg.contains("EMPLEADO_CORREO_UK") || lowerMsg.contains("correo") ||
                        msg.contains("USUARIO_NOMBRE_UK") || lowerMsg.contains("nombreusuario") || lowerMsg.contains("nombre_usuario")) {
                    return ResponseEntity.badRequest().body("El número de identificación y o correo no se pueden repetir");
                }
                if (lowerMsg.contains("rol") && lowerMsg.contains("obligatorio")) {
                    return ResponseEntity.badRequest().body("Debe seleccionar al menos un rol");
                }
            }
            return ResponseEntity.badRequest().body("Error al registrar usuario: " + e.getMessage());
        }
    }
    // Endpoint para verificar si la identificación ya existe
    @CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
    @GetMapping("/verificar-identificacion/{identificacion}")
    public ResponseEntity<?> verificarIdentificacion(@PathVariable String identificacion) {
        try {
            boolean exists = authService.existeIdentificacion(identificacion);
            return ResponseEntity.ok().body(java.util.Collections.singletonMap("exists", exists));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al verificar identificación");
        }
    }
}
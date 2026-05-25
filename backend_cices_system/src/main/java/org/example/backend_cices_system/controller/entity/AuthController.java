package org.example.backend_cices_system.controller.entity;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.dto.entity.auth.LoginRequest;
import org.example.backend_cices_system.service.entity.auth.AuthService;
import org.example.backend_cices_system.service.entity.auth.LoginAttemptService;
import org.example.backend_cices_system.service.entity.PasswordResetService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final LoginAttemptService attemptService;
    private final PasswordResetService passwordResetService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        try {
            var resp = authService.login(req.username(), req.password());
            return ResponseEntity.ok(resp);
        } catch (org.springframework.security.authentication.LockedException ex) {
            long remain = attemptService.blockMinutesRemaining(req.username());
            return ResponseEntity.status(423)
                    .contentType(org.springframework.http.MediaType.APPLICATION_JSON)
                    .body(java.util.Map.of("error","Cuenta bloqueada temporalmente","remainingMinutes",remain));
        } catch (org.springframework.security.authentication.BadCredentialsException ex) {
            int remaining = attemptService.remaining(req.username());
            return ResponseEntity.status(401)
                    .header("X-Login-Attempts-Remaining", String.valueOf(remaining))
                    .contentType(org.springframework.http.MediaType.APPLICATION_JSON)
                    .body(java.util.Map.of("error","Credenciales inválidas","remaining",remaining));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestParam String correo) {
        try {
            passwordResetService.solicitarReset(correo.trim());
            return ResponseEntity.ok("Correo enviado correctamente a: " + correo);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(404).body(ex.getMessage());
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> body) {
        try {
            String token = body.get("token");
            String nuevaPassword = body.get("nuevaPassword");

            passwordResetService.resetearPassword(token, nuevaPassword);

            return ResponseEntity.ok("Contraseña actualizada correctamente");
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(mensajeAmigableReset(ex.getMessage()));
        }
    }

    private String mensajeAmigableReset(String mensajeError) {
        if (mensajeError == null) {
            return "No se pudo actualizar la contraseña. Intente nuevamente.";
        }

        String mensaje = mensajeError.toLowerCase();

        if (mensaje.contains("ya usado")) {
            return "Este enlace ya fue utilizado. Solicite uno nuevo para continuar.";
        }

        if (mensaje.contains("expirado")) {
            return "El tiempo de uso de este enlace expiró. Solicite uno nuevo para continuar.";
        }

        if (mensaje.contains("inval") || mensaje.contains("válid")) {
            return "Este enlace no es válido. Solicite uno nuevo para continuar.";
        }

        return "No se pudo actualizar la contraseña. Intente nuevamente.";
    }
}

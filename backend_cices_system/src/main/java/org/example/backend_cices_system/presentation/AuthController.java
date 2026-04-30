package org.example.backend_cices_system.presentation;
import org.example.backend_cices_system.dto.auth.LoginRequest;
import org.example.backend_cices_system.service.AuthService;
import org.example.backend_cices_system.service.LoginAttemptService;
import org.example.backend_cices_system.service.PasswordResetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AuthController {

    private final AuthService authService;
    private final LoginAttemptService attemptService;
    @Autowired
    private PasswordResetService passwordResetService;

    public AuthController(AuthService authService, LoginAttemptService attemptService,
                          PasswordResetService passwordResetService) {
        this.authService = authService;
        this.attemptService = attemptService;
        this.passwordResetService = passwordResetService;
    }

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

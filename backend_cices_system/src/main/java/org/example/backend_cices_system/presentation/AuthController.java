package org.example.backend_cices_system.presentation;
import org.example.backend_cices_system.dto.LoginRequest;
import org.example.backend_cices_system.dto.LoginResponse;
import org.example.backend_cices_system.service.AuthService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AuthController {

    private final AuthService authService;
    public AuthController(AuthService authService) { this.authService = authService; }

    @org.springframework.web.bind.annotation.PostMapping("/login")
    public org.springframework.http.ResponseEntity<LoginResponse> login(
            @org.springframework.web.bind.annotation.RequestBody LoginRequest req) {
        return org.springframework.http.ResponseEntity.ok(authService.login(req.username(), req.password()));
    }
}

package org.example.backend_cices_system.service.entity.auth;
import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.dto.entity.auth.LoginResponse;
import org.example.backend_cices_system.dto.entity.auth.UserInfo;
import org.example.backend_cices_system.security.JwtUtil;
import org.example.backend_cices_system.service.entity.RolUsuarioService;
import org.example.backend_cices_system.service.entity.UsuarioService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthService {
    private final PasswordEncoder encoder;
    private final JwtUtil jwt;
    private final LoginAttemptService attemptService;
    private final UsuarioService usuarioService;
    private final RolUsuarioService rolUsuarioService;

    public LoginResponse login(String username, String password) {
        if (attemptService.isBlocked(username))
            throw new org.springframework.security.authentication.LockedException("Usuario bloqueado por intentos fallidos");

        var u = usuarioService.obtenerUsuarioActivo(username)
                .orElseThrow(() -> {
                    attemptService.onFailure(username);
                    return new org.springframework.security.authentication.BadCredentialsException("Credenciales inválidas");
                });

        var stored = Optional.ofNullable(u.getContrasena()).orElse("").trim();
        if (stored.startsWith("{bcrypt}")) stored = stored.substring("{bcrypt}".length());

        boolean ok = !stored.isBlank() &&
                (stored.startsWith("$2") ? encoder.matches(password, stored) : stored.equals(password));

        if (!ok) {
            attemptService.onFailure(username);
            throw new org.springframework.security.authentication.BadCredentialsException("Credenciales inválidas");
        }

        attemptService.onSuccess(username);

        var roles = rolUsuarioService.obtenerRolesUsuarioPorIdUsuario(u.getId());
        var token = jwt.generate(u.getNombreUsuario(), roles);
        var nombre = u.getNombreUsuario().split("\\.")[0];

        return new LoginResponse(token, new UserInfo(u.getId(), u.getNombreUsuario(), nombre, roles));
    }

}

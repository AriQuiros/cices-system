package org.example.backend_cices_system.service;
import org.example.backend_cices_system.data.RolUsuarioRepository;
import org.example.backend_cices_system.data.UsuarioRepository;
import org.example.backend_cices_system.dto.LoginResponse;
import org.example.backend_cices_system.dto.UserInfo;
import org.example.backend_cices_system.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.Optional;

@org.springframework.stereotype.Service
@org.springframework.transaction.annotation.Transactional(readOnly = true)
public class AuthService {
    private final PasswordEncoder encoder;
    private final JwtUtil jwt;
    private final UsuarioRepository usuarioRepository;
    private final RolUsuarioRepository rolUsuarioRepository;

    public AuthService(UsuarioRepository u,
                       RolUsuarioRepository r,
                       PasswordEncoder enc,
                       JwtUtil jwt) {
        this.usuarioRepository = u;
        this.rolUsuarioRepository = r;
        this.encoder = enc;
        this.jwt = jwt;
    }

    public LoginResponse login(String username, String password) {
        System.out.println("req username=" + username +
                " password.len=" + (password != null ? password.length() : null));

        var u = usuarioRepository.findActiveByUsername(username)
                .orElseThrow(() ->
                        new org.springframework.security.authentication.BadCredentialsException("Credenciales inválidas"));

        var stored = Optional.ofNullable(u.getContrasena()).orElse("").trim();

        System.out.println("stored=" + stored);
        System.out.println("stored.startsWith$2=" + stored.startsWith("$2") +
                " matches=" + encoder.matches(password, stored));

        if (stored.startsWith("{bcrypt}")) {
            stored = stored.substring("{bcrypt}".length());
        }

        boolean ok = !stored.isBlank() &&
                (stored.startsWith("$2")
                        ? encoder.matches(password, stored)
                        : stored.equals(password));

        if (!ok) {
            throw new org.springframework.security.authentication.BadCredentialsException("Credenciales inválidas");
        }

        var roles = rolUsuarioRepository.findRoleNamesByUsuarioId(u.getId());
        var token = jwt.generate(u.getNombreUsuario(), roles);
        var nombre = u.getIdEmpleado() != null ? u.getIdEmpleado().getNombreCompleto() : null;

        return new LoginResponse(
                token,
                new UserInfo(u.getId(), u.getNombreUsuario(), nombre, roles)
        );
    }
}

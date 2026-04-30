package org.example.backend_cices_system.modules.usuario.service;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.modules.usuario.repository.PasswordResetTokenRepository;
import org.example.backend_cices_system.modules.usuario.model.PasswordResetToken;
import org.example.backend_cices_system.shared.email.EmailService;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;

@Service
@RequiredArgsConstructor
public class PasswordResetService {

    private final PasswordResetTokenRepository tokenRepository;
    private final EmailService emailService;
    private final UsuarioService usuarioService;

    public void solicitarReset(String correo) {
        System.out.println("buscando correo... " + correo);
        var usuarioOpt = usuarioService.obtenerUsuarioActivo(correo);

        if (usuarioOpt.isEmpty()) {
            throw new IllegalArgumentException("No existe un usuario activo asociado a este correo");
        }

        var usuario = usuarioOpt.get();

        String token = generarToken();

        String tokenHash = hashToken(token);

        // Crear entidad
        var prt = new PasswordResetToken();
        prt.setIdUsuario(usuario);
        prt.setTokenHash(tokenHash);
        prt.setFechaCreacion(LocalDateTime.now());
        prt.setFechaExpiracion(LocalDateTime.now().plusMinutes(20));
        prt.setUsado(false);

        tokenRepository.save(prt);

        // Enlace
        String link = "http://localhost:5173/reset-password?token=" + token;

        emailService.enviarCorreoReset(correo, link);
    }

    private String generarToken() {
        byte[] bytes = new byte[32];
        new SecureRandom().nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private String hashToken(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(token.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hash);
        } catch (Exception e) {
            throw new RuntimeException("Error hashing token");
        }
    }

    public void resetearPassword(String token, String nuevaPassword) {

        String tokenHash = hashToken(token);

        PasswordResetToken prt = tokenRepository.findByTokenHash(tokenHash)
                .orElseThrow(() -> new RuntimeException("Token inválido"));

        // Validaciones
        if (prt.getUsado()) {
            throw new RuntimeException("Token ya usado");
        }

        if (prt.getFechaExpiracion().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token expirado");
        }

        var usuario = usuarioService.obtenerUsuario(prt.getIdUsuario().getId());
        usuarioService.cambiarContrasena(usuario, nuevaPassword);

        prt.setUsado(true);
        tokenRepository.save(prt);
    }
}
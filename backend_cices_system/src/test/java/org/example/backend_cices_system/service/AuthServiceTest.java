package org.example.backend_cices_system.service;

import org.example.backend_cices_system.dto.auth.LoginResponse;
import org.example.backend_cices_system.logic.Usuario;
import org.example.backend_cices_system.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private PasswordEncoder encoder;

    @Mock
    private JwtUtil jwt;

    @Mock
    private LoginAttemptService attemptService;

    @Mock
    private UsuarioService usuarioService;

    @Mock
    private RolUsuarioService rolUsuarioService;

    @InjectMocks
    private AuthService authService;

    private Usuario usuario;

    @BeforeEach
    void setUp() {
        usuario = new Usuario();
        usuario.setId(1);
        usuario.setNombreUsuario("juan.perez");
        usuario.setContrasena("$2a$10$hashEjemplo");
        usuario.setActivo(true);
    }

    @Test
    void login_deberiaRetornarToken_cuandoCredencialesSonValidas() {
        when(attemptService.isBlocked("juan.perez")).thenReturn(false);
        when(usuarioService.obtenerUsuarioActivo("juan.perez")).thenReturn(Optional.of(usuario));
        when(encoder.matches("123456", "$2a$10$hashEjemplo")).thenReturn(true);
        when(rolUsuarioService.obtenerRolesUsuarioPorIdUsuario(1)).thenReturn(List.of("DIRECTOR"));
        when(jwt.generate("juan.perez", List.of("DIRECTOR"))).thenReturn("fake-jwt-token");

        LoginResponse response = authService.login("juan.perez", "123456");

        assertNotNull(response);
        assertEquals("fake-jwt-token", response.token());
        assertEquals("juan.perez", response.user().username());

        verify(attemptService).onSuccess("juan.perez");
        verify(attemptService, never()).onFailure(anyString());
    }

    @Test
    void login_deberiaLanzarExcepcion_cuandoUsuarioEstaBloqueado() {
        when(attemptService.isBlocked("juan.perez")).thenReturn(true);

        assertThrows(LockedException.class, () ->
                authService.login("juan.perez", "123456"));

        verify(usuarioService, never()).obtenerUsuarioActivo(anyString());
    }

    @Test
    void login_deberiaLanzarExcepcion_cuandoUsuarioNoExiste() {
        when(attemptService.isBlocked("juan.perez")).thenReturn(false);
        when(usuarioService.obtenerUsuarioActivo("juan.perez")).thenReturn(Optional.empty());

        assertThrows(BadCredentialsException.class, () ->
                authService.login("juan.perez", "123456"));

        verify(attemptService).onFailure("juan.perez");
    }

    @Test
    void login_deberiaLanzarExcepcion_cuandoPasswordEsIncorrecto() {
        when(attemptService.isBlocked("juan.perez")).thenReturn(false);
        when(usuarioService.obtenerUsuarioActivo("juan.perez")).thenReturn(Optional.of(usuario));
        when(encoder.matches("incorrecta", "$2a$10$hashEjemplo")).thenReturn(false);

        assertThrows(BadCredentialsException.class, () ->
                authService.login("juan.perez", "incorrecta"));

        verify(attemptService).onFailure("juan.perez");
    }
}
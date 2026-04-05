package org.example.backend_cices_system.presentation;

import org.example.backend_cices_system.dto.auth.LoginResponse;
import org.example.backend_cices_system.dto.auth.UserInfo;
import org.example.backend_cices_system.service.AuthService;
import org.example.backend_cices_system.service.LoginAttemptService;
import org.example.backend_cices_system.service.PasswordResetService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.LockedException;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class AuthControllerTest {

    private MockMvc mockMvc;
    private AuthService authService;
    private LoginAttemptService attemptService;
    private PasswordResetService passwordResetService;

    @BeforeEach
    void setUp() {
        authService = Mockito.mock(AuthService.class);
        attemptService = Mockito.mock(LoginAttemptService.class);

        AuthController controller = new AuthController(authService, attemptService, passwordResetService);

        mockMvc = MockMvcBuilders
                .standaloneSetup(controller)
                .build();
    }

    @Test
    @DisplayName("POST /auth/login debe retornar 200 cuando las credenciales son válidas")
    void login_deberiaRetornar200_cuandoCredencialesSonValidas() throws Exception {
        LoginResponse response = new LoginResponse(
                "fake-jwt-token",
                new UserInfo(1, "juan.perez", "Juan Pérez", List.of("DIRECTOR"))
        );

        when(authService.login("juan.perez", "123456")).thenReturn(response);

        String body = """
                {
                  "username": "juan.perez",
                  "password": "123456"
                }
                """;

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("fake-jwt-token"))
                .andExpect(jsonPath("$.user.id").value(1))
                .andExpect(jsonPath("$.user.username").value("juan.perez"));
    }

    @Test
    @DisplayName("POST /auth/login debe retornar 401 cuando las credenciales son inválidas")
    void login_deberiaRetornar401_cuandoCredencialesSonInvalidas() throws Exception {
        when(authService.login("juan.perez", "mala"))
                .thenThrow(new BadCredentialsException("Credenciales inválidas"));
        when(attemptService.remaining("juan.perez")).thenReturn(2);

        String body = """
                {
                  "username": "juan.perez",
                  "password": "mala"
                }
                """;

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("POST /auth/login debe retornar 423 cuando la cuenta está bloqueada")
    void login_deberiaRetornar423_cuandoCuentaEstaBloqueada() throws Exception {
        when(authService.login("juan.perez", "123456"))
                .thenThrow(new LockedException("Cuenta bloqueada"));
        when(attemptService.blockMinutesRemaining("juan.perez")).thenReturn(5L);

        String body = """
                {
                  "username": "juan.perez",
                  "password": "123456"
                }
                """;

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isLocked());
    }
}
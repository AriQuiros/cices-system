package org.example.backend_cices_system.presentation;

import org.example.backend_cices_system.dto.LoginRequest;
import org.example.backend_cices_system.dto.LoginResponse;
import org.example.backend_cices_system.dto.UserInfo;
import org.example.backend_cices_system.service.AuthService;
import org.example.backend_cices_system.service.LoginAttemptService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import java.util.List;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock private AuthService authService;
    @Mock private LoginAttemptService attemptService; // si el controller lo inyecta
    @InjectMocks private AuthController controller;

    @Test
    void testLoginSuccess() {
        when(authService.login("test","password"))
                .thenReturn(new LoginResponse("test-token",
                        new UserInfo((short)1, "test", "Test User", List.of("ADMINISTRADOR"))));

        LoginRequest request = new LoginRequest("test","password");

        ResponseEntity<?> response = controller.login(request);   // usa <?>

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody() instanceof LoginResponse);
        var body = (LoginResponse) response.getBody();
        assertEquals("test-token", body.token());
        assertEquals("test", body.user().username());
        assertEquals("Test User", body.user().nombreCompleto());
        assertEquals(List.of("ADMINISTRADOR"), body.user().roles());

        verify(authService).login("test","password");
        verifyNoMoreInteractions(authService, attemptService);
    }

    @Test
    void testLoginBadCredentials() {
        when(authService.login("bad","x"))
                .thenThrow(new BadCredentialsException("x"));
        when(attemptService.remaining("bad")).thenReturn(3);

        var response = controller.login(new LoginRequest("bad","x"));

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals("3", response.getHeaders().getFirst("X-Login-Attempts-Remaining"));
        assertEquals(org.springframework.http.MediaType.APPLICATION_JSON, response.getHeaders().getContentType());

        var body = (Map<?,?>) response.getBody();
        assertEquals("Credenciales inválidas", body.get("error"));
        assertEquals(3, body.get("remaining"));
    }


    @Test
    void testLoginLocked() {
        when(authService.login("lock","x"))
                .thenThrow(new org.springframework.security.authentication.LockedException("x"));
        when(attemptService.blockMinutesRemaining("lock")).thenReturn(12L);

        var response = controller.login(new LoginRequest("lock","x"));

        assertEquals(423, response.getStatusCodeValue());
        var body = (Map<?,?>) response.getBody();
        assertEquals("Cuenta bloqueada temporalmente", body.get("error"));
        assertEquals(12L, body.get("remainingMinutes"));
    }
}

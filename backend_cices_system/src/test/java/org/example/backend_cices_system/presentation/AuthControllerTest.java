package org.example.backend_cices_system.presentation;

import org.example.backend_cices_system.dto.LoginRequest;
import org.example.backend_cices_system.dto.LoginResponse;
import org.example.backend_cices_system.dto.UserInfo;
import org.example.backend_cices_system.service.AuthService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private AuthService authService;

    @InjectMocks
    private AuthController controller;

    @Test
    void testLoginSuccess() {
        // Arrange: lo que debe devolver el AuthService cuando se llame con "test", "password"
        when(authService.login("test", "password"))
                .thenReturn(new LoginResponse("test-token", new UserInfo((short) 1, "test", "Test User", List.of("ADMINISTRADOR"))));

        // Creamos la petición que se enviará al controlador
        LoginRequest request = new LoginRequest("test", "password");

        // Act: ejecutamos el login del controlador
        ResponseEntity<LoginResponse> response = controller.login(request);

        // Assert: verificamos la respuesta devuelta
        assertEquals("test-token", response.getBody().token());
        assertEquals("test", response.getBody().user().username());
        assertEquals("Test User", response.getBody().user().nombreCompleto());
        assertEquals(List.of("ADMINISTRADOR"), response.getBody().user().roles());
    }
}

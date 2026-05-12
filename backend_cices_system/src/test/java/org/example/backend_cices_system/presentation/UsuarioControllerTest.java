package org.example.backend_cices_system.presentation;

import org.example.backend_cices_system.service.UsuarioService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Map;

import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class UsuarioControllerTest {

    @Mock
    private UsuarioService usuarioService;

    @InjectMocks
    private UsuarioController controller;

    @Test
    void cambiarEstado_debeEnviarCorrectamenteLosDatosAlService() {
        controller.cambiarEstado(1, Map.of("activo", false));

        verify(usuarioService).cambiarEstadoUsuario(1, false);
    }
}
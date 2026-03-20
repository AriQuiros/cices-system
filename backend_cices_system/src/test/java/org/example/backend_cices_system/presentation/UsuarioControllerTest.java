package org.example.backend_cices_system.presentation;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.backend_cices_system.service.UsuarioService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Map;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class UsuarioControllerTest {

    private MockMvc mockMvc;
    private UsuarioService usuarioService;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        usuarioService = mock(UsuarioService.class);
        objectMapper = new ObjectMapper();

        UsuarioController controller = new UsuarioController(usuarioService);

        mockMvc = MockMvcBuilders
                .standaloneSetup(controller)
                .build();
    }

    @Test
    void cambiarEstado_deberiaRetornar200_yLlamarServicio() throws Exception {
        Map<String, Boolean> body = Map.of("activo", false);

        mockMvc.perform(put("/api/usuarios/5/estado")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk());

        verify(usuarioService).cambiarEstadoUsuario(5, false);
    }
}
package org.example.backend_cices_system.presentation;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.backend_cices_system.dto.InvestigadorProyectoDTO;
import org.example.backend_cices_system.dto.PermisoProyectoDTO;
import org.example.backend_cices_system.dto.RolProyectoDTO;
import org.example.backend_cices_system.service.PermisoProyectoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDate;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class PermisoProyectoControllerTest {

    @Mock
    private PermisoProyectoService permisoProyectoService;

    @InjectMocks
    private PermisoProyectoController permisoProyectoController;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    private PermisoProyectoDTO permisoProyectoDTO;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(permisoProyectoController).build();
        objectMapper = new ObjectMapper();
        objectMapper.findAndRegisterModules();

        InvestigadorProyectoDTO investigadorProyectoDTO = new InvestigadorProyectoDTO(
                10,
                "123456789",
                "Ana Rodríguez",
                "bachi",
                "PR-001",
                new RolProyectoDTO((short) 1, "Director"),
                "Investigación",
                LocalDate.of(2026, 1, 1),
                LocalDate.of(2026, 12, 31)
        );

        permisoProyectoDTO = new PermisoProyectoDTO(
                100,
                investigadorProyectoDTO,
                LocalDate.of(2026, 4, 17),
                LocalDate.of(2026, 12, 31)
        );
    }

    @Test
    void obtenerPorProyecto_deberiaRetornarLista() throws Exception {
        when(permisoProyectoService.obtenerDTOsPorCodigoProyecto("PR-001"))
                .thenReturn(List.of(permisoProyectoDTO));

        mockMvc.perform(get("/api/permiso-proyecto/obtener/PR-001"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].id").value(100))
                .andExpect(jsonPath("$[0].investigadorProyectoDTO.id").value(10))
                .andExpect(jsonPath("$[0].investigadorProyectoDTO.codigoProyecto").value("PR-001"))
                .andExpect(jsonPath("$[0].fechaInicio[0]").value(2026))
                .andExpect(jsonPath("$[0].fechaInicio[1]").value(4))
                .andExpect(jsonPath("$[0].fechaInicio[2]").value(17))
                .andExpect(jsonPath("$[0].fechaFin[0]").value(2026))
                .andExpect(jsonPath("$[0].fechaFin[1]").value(12))
                .andExpect(jsonPath("$[0].fechaFin[2]").value(31));

        verify(permisoProyectoService).obtenerDTOsPorCodigoProyecto("PR-001");
    }

    @Test
    void create_deberiaRetornarPermisoGuardado() throws Exception {
        when(permisoProyectoService.save(any(PermisoProyectoDTO.class)))
                .thenReturn(permisoProyectoDTO);

        mockMvc.perform(post("/api/permiso-proyecto/otorgar")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(permisoProyectoDTO)))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(100))
                .andExpect(jsonPath("$.investigadorProyectoDTO.id").value(10))
                .andExpect(jsonPath("$.investigadorProyectoDTO.codigoProyecto").value("PR-001"))
                .andExpect(jsonPath("$.fechaInicio[0]").value(2026))
                .andExpect(jsonPath("$.fechaInicio[1]").value(4))
                .andExpect(jsonPath("$.fechaInicio[2]").value(17))
                .andExpect(jsonPath("$.fechaFin[0]").value(2026))
                .andExpect(jsonPath("$.fechaFin[1]").value(12))
                .andExpect(jsonPath("$.fechaFin[2]").value(31));

        verify(permisoProyectoService).save(any(PermisoProyectoDTO.class));
    }

    @Test
    void delete_deberiaInvocarServicio() throws Exception {
        mockMvc.perform(delete("/api/permiso-proyecto/remover/100"))
                .andExpect(status().isOk());

        verify(permisoProyectoService).delete(100);
    }
}
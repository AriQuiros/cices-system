package org.example.backend_cices_system.presentation;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.backend_cices_system.dto.CodigoDTO;
import org.example.backend_cices_system.dto.HorasAsignadasDTO;
import org.example.backend_cices_system.dto.InvestigadorProyectoDTO;
import org.example.backend_cices_system.dto.RolProyectoDTO;
import org.example.backend_cices_system.exception.GlobalExceptionHandler;
import org.example.backend_cices_system.service.HorasAsignadasService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDate;
import java.util.List;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class HorasAsignadasControllerTest {

    private MockMvc mockMvc;
    private HorasAsignadasService horasAsignadasService;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        horasAsignadasService = mock(HorasAsignadasService.class);
        objectMapper = new ObjectMapper();
        objectMapper.findAndRegisterModules();

        HorasAsignadasController controller = new HorasAsignadasController(horasAsignadasService);

        mockMvc = MockMvcBuilders
                .standaloneSetup(controller)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void registrarHora_deberiaRetornar200() throws Exception {
        InvestigadorProyectoDTO investigador = new InvestigadorProyectoDTO(
                10,
                "123",
                "Ana",
                "Licenciatura",
                "PR-001",
                new RolProyectoDTO((short) 1, "Principal"),
                "Análisis",
                LocalDate.of(2025, 1, 1),
                LocalDate.of(2025, 12, 31)
        );

        HorasAsignadasDTO dto = new HorasAsignadasDTO(
                null,
                investigador,
                7,
                new CodigoDTO((short) 1, "REGIMEN_TIEMPO", "Régimen por tiempo"),
                new CodigoDTO((short) 2, "ORDINARIAS", "Ordinarias"),
                20.0,
                (short) 2
        );

        when(horasAsignadasService.guardarHorasAsignadas(anyList())).thenReturn(1);

        mockMvc.perform(post("/api/horas/registro")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(List.of(dto))))
                .andExpect(status().isOk());

        verify(horasAsignadasService).guardarHorasAsignadas(anyList());
    }

    @Test
    void actualizarHora_deberiaRetornar200() throws Exception {
        InvestigadorProyectoDTO investigador = new InvestigadorProyectoDTO(
                10,
                "123",
                "Ana",
                "Bachillerato",
                "PR-001",
                new RolProyectoDTO((short) 1, "Principal"),
                "Actualizada",
                LocalDate.of(2025, 1, 1),
                LocalDate.of(2025, 12, 31)
        );

        HorasAsignadasDTO dto = new HorasAsignadasDTO(
                99,
                investigador,
                7,
                new CodigoDTO((short) 1, "REGIMEN_TIEMPO", "Régimen por tiempo"),
                new CodigoDTO((short) 2, "ORDINARIAS", "Ordinarias"),
                20.0,
                (short) 2
        );

        when(horasAsignadasService.actualizarHora(any(HorasAsignadasDTO.class))).thenReturn(dto);

        mockMvc.perform(put("/api/horas/actualizar")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk());

        verify(horasAsignadasService).actualizarHora(any(HorasAsignadasDTO.class));
    }

    @Test
    void eliminarHora_deberiaRetornar200() throws Exception {
        when(horasAsignadasService.eliminarHora(15)).thenReturn(null);

        mockMvc.perform(delete("/api/horas/eliminar/15"))
                .andExpect(status().isOk());

        verify(horasAsignadasService).eliminarHora(15);
    }
}
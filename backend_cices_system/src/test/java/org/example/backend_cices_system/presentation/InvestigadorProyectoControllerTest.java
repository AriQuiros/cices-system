package org.example.backend_cices_system.presentation;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.backend_cices_system.dto.InvestigadorProyectoDTO;
import org.example.backend_cices_system.dto.RolProyectoDTO;
import org.example.backend_cices_system.exception.GlobalExceptionHandler;
import org.example.backend_cices_system.logic.Investigador;
import org.example.backend_cices_system.logic.Proyecto;
import org.example.backend_cices_system.service.HorasAsignadasService;
import org.example.backend_cices_system.service.InvestigadorProyectoService;
import org.example.backend_cices_system.service.InvestigadorService;
import org.example.backend_cices_system.service.ProyectoService;
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
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class InvestigadorProyectoControllerTest {

    private MockMvc mockMvc;
    private InvestigadorProyectoService investigadorProyectoService;
    private ProyectoService proyectoService;
    private InvestigadorService investigadorService;
    private HorasAsignadasService horasAsignadasService;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        investigadorProyectoService = mock(InvestigadorProyectoService.class);
        proyectoService = mock(ProyectoService.class);
        investigadorService = mock(InvestigadorService.class);
        horasAsignadasService = mock(HorasAsignadasService.class);

        objectMapper = new ObjectMapper();
        objectMapper.findAndRegisterModules();

        InvestigadorProyectoController controller =
                new InvestigadorProyectoController(
                        investigadorProyectoService,
                        proyectoService,
                        investigadorService,
                        horasAsignadasService
                );

        mockMvc = MockMvcBuilders
                .standaloneSetup(controller)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void asignarInvestigador_deberiaRetornar200() throws Exception {
        InvestigadorProyectoDTO dto = new InvestigadorProyectoDTO(
                null,
                "123456789",
                "Ana Rodríguez",
                "Diplomado",
                "PR-001",
                new RolProyectoDTO((short) 2, "Colaborador"),
                "Trabajo de campo",
                LocalDate.of(2025, 2, 1),
                LocalDate.of(2025, 6, 30)
        );

        Proyecto proyecto = mock(Proyecto.class);
        Investigador investigador = mock(Investigador.class);

        when(proyectoService.buscarProyectoPorCodigo("PR-001")).thenReturn(proyecto);
        when(investigadorService.buscarPorIdentificacion("123456789")).thenReturn(investigador);

        mockMvc.perform(post("/api/investigador-proyecto/registro")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(List.of(dto))))
                .andExpect(status().isOk())
                .andExpect(content().string("1"));

        verify(proyectoService).buscarProyectoPorCodigo("PR-001");
        verify(investigadorService).buscarPorIdentificacion("123456789");
        verify(investigadorProyectoService)
                .guardarInvestigadorProyecto(eq(dto), eq(investigador), eq(proyecto));
    }

    @Test
    void actualizarInvestigadorProyecto_deberiaRetornar200() throws Exception {
        InvestigadorProyectoDTO dto = new InvestigadorProyectoDTO(
                55,
                "123456789",
                "Ana Rodríguez",
                "Licenciatura",
                "PR-001",
                new RolProyectoDTO((short) 3, "Asistente"),
                "Trabajo actualizado",
                LocalDate.of(2025, 3, 1),
                LocalDate.of(2025, 8, 31)
        );

        when(investigadorProyectoService.actualizarInvestigadorProyecto(any(InvestigadorProyectoDTO.class)))
                .thenReturn(dto);

        mockMvc.perform(put("/api/investigador-proyecto/actualizar")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk());

        verify(investigadorProyectoService)
                .actualizarInvestigadorProyecto(any(InvestigadorProyectoDTO.class));
    }

    @Test
    void eliminarInvestigadorProyecto_deberiaRetornar409_siTieneHorasAsignadas() throws Exception {
        when(horasAsignadasService.existInvProyecto(55)).thenReturn(true);

        mockMvc.perform(delete("/api/investigador-proyecto/eliminar/55"))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message")
                        .value("No se puede eliminar: El investigador tiene horas asignadas"));

        verify(horasAsignadasService).existInvProyecto(55);
        verify(investigadorProyectoService, never()).eliminarInvestigadorProyecto(anyInt());
    }

    @Test
    void eliminarInvestigadorProyecto_deberiaRetornar200_siNoTieneHorasAsignadas() throws Exception {
        when(horasAsignadasService.existInvProyecto(55)).thenReturn(false);
        when(investigadorProyectoService.eliminarInvestigadorProyecto(55)).thenReturn(null);

        mockMvc.perform(delete("/api/investigador-proyecto/eliminar/55"))
                .andExpect(status().isOk());

        verify(horasAsignadasService).existInvProyecto(55);
        verify(investigadorProyectoService).eliminarInvestigadorProyecto(55);
    }
}
package org.example.backend_cices_system.presentation;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.backend_cices_system.dto.GastoDTO;
import org.example.backend_cices_system.dto.InvestigadorDTO;
import org.example.backend_cices_system.service.InvestigadorService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.junit.jupiter.api.Assertions.*;


@ExtendWith(MockitoExtension.class)
public class InvestigadorControllerTest {

    @Mock
    private InvestigadorService investigadorService;

    @InjectMocks
    private InvestigadorController investigadorController;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;
    private GastoDTO gastoDTO;
    private Authentication authentication;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(investigadorController).build();
        objectMapper = new ObjectMapper();
        objectMapper.findAndRegisterModules(); // Para manejar LocalDate
        
        // Configurar datos de prueba
        gastoDTO = new GastoDTO();
        gastoDTO.setIdProyecto(1);
        gastoDTO.setMonto(new BigDecimal("1500.00"));
        gastoDTO.setFechaGasto(LocalDate.now());
        gastoDTO.setCategoriaGasto("Equipos");
        gastoDTO.setDescripcion("Compra de laptop para investigación");
        
        // Mock de autenticación
        authentication = new UsernamePasswordAuthenticationToken("testuser", "password");
    }

    @Test
    void testRegistrarGasto_Exitoso() throws Exception {
        // Given
        when(investigadorService.registrarGasto(any(GastoDTO.class))).thenReturn(true);

        // When & Then
        mockMvc.perform(post("/api/investigador/registrar-gasto")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(gastoDTO))
                .principal(authentication))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.exito").value(true))
                .andExpect(jsonPath("$.mensaje").value("Gasto registrado exitosamente"));

        verify(investigadorService, times(1)).registrarGasto(any(GastoDTO.class));
    }

    @Test
    void testRegistrarGasto_Fallido_ExcedePresupuesto() throws Exception {
        // Given
        when(investigadorService.registrarGasto(any(GastoDTO.class))).thenReturn(false);

        // When & Then
        mockMvc.perform(post("/api/investigador/registrar-gasto")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(gastoDTO))
                .principal(authentication))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.exito").value(false))
                .andExpect(jsonPath("$.mensaje").value("No se pudo registrar el gasto. Verifique que el monto no exceda el presupuesto disponible."));

        verify(investigadorService, times(1)).registrarGasto(any(GastoDTO.class));
    }

    @Test
    void testRegistrarGasto_SinAutenticacion() throws Exception {
        // When & Then
        mockMvc.perform(post("/api/investigador/registrar-gasto")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(gastoDTO)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.exito").value(false))
                .andExpect(jsonPath("$.mensaje").value("Usuario no autenticado"));

        verify(investigadorService, never()).registrarGasto(any(GastoDTO.class));
    }

    @Test
    void testRegistrarGasto_ErrorInterno() throws Exception {
        // Given
        when(investigadorService.registrarGasto(any(GastoDTO.class)))
                .thenThrow(new RuntimeException("Error de base de datos"));

        // When & Then
        mockMvc.perform(post("/api/investigador/registrar-gasto")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(gastoDTO))
                .principal(authentication))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.exito").value(false))
                .andExpect(jsonPath("$.mensaje").value("Error interno del servidor: Error de base de datos"));

        verify(investigadorService, times(1)).registrarGasto(any(GastoDTO.class));
    }

    @Test
    void testRegistrarGasto_ConDatosValidos() throws Exception {
        // Given
        GastoDTO gastoValido = new GastoDTO();
        gastoValido.setIdProyecto(2);
        gastoValido.setMonto(new BigDecimal("2500.50"));
        gastoValido.setFechaGasto(LocalDate.of(2025, 10, 13));
        gastoValido.setCategoriaGasto("Material de oficina");
        gastoValido.setDescripcion("Papelería y suministros para el proyecto");

        when(investigadorService.registrarGasto(any(GastoDTO.class))).thenReturn(true);

        // When & Then
        mockMvc.perform(post("/api/investigador/registrar-gasto")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(gastoValido))
                .principal(authentication))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.exito").value(true));

        verify(investigadorService, times(1)).registrarGasto(any(GastoDTO.class));
    }

    @Test
    void testRegistrarGasto_ConMontoDecimal() throws Exception {
        // Given
        gastoDTO.setMonto(new BigDecimal("999.99"));
        when(investigadorService.registrarGasto(any(GastoDTO.class))).thenReturn(true);

        // When & Then
        mockMvc.perform(post("/api/investigador/registrar-gasto")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(gastoDTO))
                .principal(authentication))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.exito").value(true));

        verify(investigadorService, times(1)).registrarGasto(any(GastoDTO.class));
    }

    @Test
    void investigadores_devuelveListaCorrecta() {
        InvestigadorDTO i1 = new InvestigadorDTO((short)1, "Ana", "Biomedicina");
        InvestigadorDTO i2 = new InvestigadorDTO((short)2, "Luis", "Química");

        when(investigadorService.buscarInvestigadores("a"))
                .thenReturn(List.of(i1, i2));

        List<InvestigadorDTO> res = investigadorController.investigadores("a"); // instancia

        assertEquals(2, res.size());
        assertEquals((short)1, res.get(0).id());
        assertEquals("Ana", res.get(0).nombre());
        assertEquals("Biomedicina", res.get(0).unidad());
        verify(investigadorService).buscarInvestigadores("a");
    }

    @Test
    void investigadores_conParametroNuloLlamaServiceConNull() {
        when(investigadorService.buscarInvestigadores(null)).thenReturn(List.of());

        List<InvestigadorDTO> res = investigadorController.investigadores(null); // instancia

        assertTrue(res.isEmpty());
        verify(investigadorService).buscarInvestigadores(null);
    }

}
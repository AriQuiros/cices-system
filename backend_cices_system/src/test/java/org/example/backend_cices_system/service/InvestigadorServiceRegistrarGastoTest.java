package org.example.backend_cices_system.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import org.example.backend_cices_system.data.*;
import org.example.backend_cices_system.dto.GastoDTO;
import org.example.backend_cices_system.dto.PresupuestoDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.sql.Date;
import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class InvestigadorServiceRegistrarGastoTest {

    @Mock
    private EntityManager entityManager;
    
    @Mock
    private UsuarioRepository usuarioRepo;
    
    @Mock
    private InvestigadorRepository invRepo;
    
    @Mock
    private InvestigadorProyectoRepository invProyRepo;
    
    @Mock
    private ProyectoRepository proyectoRepo;
    
    @Mock
    private InvestigadorRepository repo;
    
    @Mock
    private Query query;

    @InjectMocks
    private InvestigadorService investigadorService;

    private GastoDTO gastoDTO;
    private PresupuestoDTO presupuestoDTO;

    @BeforeEach
    void setUp() {
        // Configurar datos de prueba
        gastoDTO = new GastoDTO();
        gastoDTO.setIdProyecto(1);
        gastoDTO.setMonto(new BigDecimal("1000.00"));
        gastoDTO.setFechaGasto(LocalDate.of(2025, 10, 13));
        gastoDTO.setCategoriaGasto("Equipos");
        gastoDTO.setDescripcion("Compra de equipos de laboratorio");

        presupuestoDTO = new PresupuestoDTO();
        presupuestoDTO.setIdPresupuesto((short) 1);
        presupuestoDTO.setMontoDisponible(new BigDecimal("5000.00"));
        presupuestoDTO.setMonto(new BigDecimal("10000.00"));
    }

    @Test
    void testRegistrarGasto_Exitoso() {
        // Given - Mockear getPresupuestoProyecto para que devuelva un presupuesto válido
        InvestigadorService spyService = spy(investigadorService);
        doReturn(presupuestoDTO).when(spyService).getPresupuestoProyecto(anyInt());
        
        // Mock de EntityManager y Query
        when(entityManager.createNativeQuery(anyString())).thenReturn(query);
        when(query.setParameter(eq(1), any())).thenReturn(query);
        when(query.setParameter(eq(2), any())).thenReturn(query);
        when(query.setParameter(eq(3), any())).thenReturn(query);
        when(query.setParameter(eq(4), any())).thenReturn(query);
        when(query.setParameter(eq(5), any())).thenReturn(query);
        when(query.executeUpdate()).thenReturn(1); // Simular inserción exitosa

        // When
        boolean resultado = spyService.registrarGasto(gastoDTO);

        // Then
        assertTrue(resultado);
        verify(spyService).getPresupuestoProyecto(1);
        verify(entityManager).createNativeQuery(contains("INSERT INTO GASTO"));
        verify(query, times(5)).setParameter(anyInt(), any());
        verify(query).executeUpdate();
    }

    @Test
    void testRegistrarGasto_SinPresupuesto() {
        // Given - Mockear getPresupuestoProyecto para que devuelva null
        InvestigadorService spyService = spy(investigadorService);
        doReturn(null).when(spyService).getPresupuestoProyecto(anyInt());

        // When
        boolean resultado = spyService.registrarGasto(gastoDTO);

        // Then
        assertFalse(resultado);
        verify(spyService).getPresupuestoProyecto(1);
        verify(entityManager, never()).createNativeQuery(anyString());
    }

    @Test
    void testRegistrarGasto_ExcedePresupuesto() {
        // Given - Presupuesto insuficiente
        presupuestoDTO.setMontoDisponible(new BigDecimal("500.00")); // Menos que el gasto
        InvestigadorService spyService = spy(investigadorService);
        doReturn(presupuestoDTO).when(spyService).getPresupuestoProyecto(anyInt());

        // When
        boolean resultado = spyService.registrarGasto(gastoDTO);

        // Then
        assertFalse(resultado);
        verify(spyService).getPresupuestoProyecto(1);
        verify(entityManager, never()).createNativeQuery(anyString());
    }

    @Test
    void testRegistrarGasto_ErrorBD() {
        // Given
        InvestigadorService spyService = spy(investigadorService);
        doReturn(presupuestoDTO).when(spyService).getPresupuestoProyecto(anyInt());
        
        when(entityManager.createNativeQuery(anyString())).thenReturn(query);
        when(query.setParameter(anyInt(), any())).thenReturn(query);
        when(query.executeUpdate()).thenThrow(new RuntimeException("Error de base de datos"));

        // When
        boolean resultado = spyService.registrarGasto(gastoDTO);

        // Then
        assertFalse(resultado);
        verify(spyService).getPresupuestoProyecto(1);
        verify(entityManager).createNativeQuery(anyString());
    }

    @Test
    void testRegistrarGasto_InsertFallido() {
        // Given - La inserción devuelve 0 (no se insertó nada)
        InvestigadorService spyService = spy(investigadorService);
        doReturn(presupuestoDTO).when(spyService).getPresupuestoProyecto(anyInt());
        
        when(entityManager.createNativeQuery(anyString())).thenReturn(query);
        when(query.setParameter(anyInt(), any())).thenReturn(query);
        when(query.executeUpdate()).thenReturn(0); // Simular inserción fallida

        // When
        boolean resultado = spyService.registrarGasto(gastoDTO);

        // Then
        assertFalse(resultado);
        verify(spyService).getPresupuestoProyecto(1);
        verify(query).executeUpdate();
    }

    @Test
    void testRegistrarGasto_ConMontoExacto() {
        // Given - Gasto exacto igual al presupuesto disponible
        gastoDTO.setMonto(new BigDecimal("5000.00")); // Igual al disponible
        InvestigadorService spyService = spy(investigadorService);
        doReturn(presupuestoDTO).when(spyService).getPresupuestoProyecto(anyInt());
        
        when(entityManager.createNativeQuery(anyString())).thenReturn(query);
        when(query.setParameter(anyInt(), any())).thenReturn(query);
        when(query.executeUpdate()).thenReturn(1);

        // When
        boolean resultado = spyService.registrarGasto(gastoDTO);

        // Then
        assertTrue(resultado);
        verify(query).executeUpdate();
    }

    @Test
    void testRegistrarGasto_ConDatosCompletos() {
        // Given - Gasto con todos los campos completos
        gastoDTO.setIdProyecto(2);
        gastoDTO.setMonto(new BigDecimal("2500.75"));
        gastoDTO.setFechaGasto(LocalDate.of(2025, 12, 25));
        gastoDTO.setCategoriaGasto("Material de oficina");
        gastoDTO.setDescripcion("Papelería y suministros varios para el desarrollo del proyecto de investigación");

        InvestigadorService spyService = spy(investigadorService);
        doReturn(presupuestoDTO).when(spyService).getPresupuestoProyecto(anyInt());
        
        when(entityManager.createNativeQuery(anyString())).thenReturn(query);
        when(query.setParameter(anyInt(), any())).thenReturn(query);
        when(query.executeUpdate()).thenReturn(1);

        // When
        boolean resultado = spyService.registrarGasto(gastoDTO);

        // Then
        assertTrue(resultado);
        
        // Verificar que se llamaron los parámetros correctos
        verify(query).setParameter(1, presupuestoDTO.getIdPresupuesto());
        verify(query).setParameter(2, gastoDTO.getMonto());
        verify(query).setParameter(3, Date.valueOf(gastoDTO.getFechaGasto()));
        verify(query).setParameter(4, gastoDTO.getCategoriaGasto());
        verify(query).setParameter(5, gastoDTO.getDescripcion());
    }

    @Test
    void testRegistrarGasto_ConMontoDecimal() {
        // Given - Gasto con decimales
        gastoDTO.setMonto(new BigDecimal("999.99"));
        InvestigadorService spyService = spy(investigadorService);
        doReturn(presupuestoDTO).when(spyService).getPresupuestoProyecto(anyInt());
        
        when(entityManager.createNativeQuery(anyString())).thenReturn(query);
        when(query.setParameter(anyInt(), any())).thenReturn(query);
        when(query.executeUpdate()).thenReturn(1);

        // When
        boolean resultado = spyService.registrarGasto(gastoDTO);

        // Then
        assertTrue(resultado);
        verify(query).setParameter(2, new BigDecimal("999.99"));
    }
}
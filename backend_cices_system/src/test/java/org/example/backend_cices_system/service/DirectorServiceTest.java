package org.example.backend_cices_system.service;

import org.example.backend_cices_system.data.*;
import org.example.backend_cices_system.dto.DirectorResumenDTO;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import java.time.LocalDate;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DirectorServiceTest {

    @Mock
    CertificacionRepository certRepo;
    @Mock
    RolUsuarioRepository rolUsuarioRepo;
    @Mock
    InvestigadorRepository invRepo;
    @Mock
    ProyectoRepository proyRepo;
    @Mock
    InvestigadorProyectoRepository invProyRepo;

    @InjectMocks DirectorService service;

    @Test
    void get_conDiasExplicitos() {
        when(rolUsuarioRepo.countInvestigadoresActivos()).thenReturn(10L);
        when(invRepo.count()).thenReturn(20L);
        when(rolUsuarioRepo.countPersonalAdministrativo()).thenReturn(5L);
        when(proyRepo.count()).thenReturn(3L);
        when(invProyRepo.countInvestigadoresAsignados()).thenReturn(15L);
        when(certRepo.countByFechaExpiracionBetween(any(), any())).thenReturn(2);

        DirectorResumenDTO dto = service.get(7);

        assertEquals(2, dto.certsPorVencer());
        assertEquals(10L, dto.investigadoresActivos());
        assertEquals(20L, dto.totalInvestigadores());
        assertEquals(5L, dto.personalAdministrativo());
        assertEquals(3L, dto.totalProyectos());
        assertEquals(15L, dto.investigadoresAsignados());

        ArgumentCaptor<LocalDate> fromCap = ArgumentCaptor.forClass(LocalDate.class);
        ArgumentCaptor<LocalDate> toCap = ArgumentCaptor.forClass(LocalDate.class);
        verify(certRepo).countByFechaExpiracionBetween(fromCap.capture(), toCap.capture());
        assertEquals(fromCap.getValue().plusDays(7), toCap.getValue());
    }

    @Test
    void get_conDiasNoPositivos_usa30PorDefecto() {
        when(rolUsuarioRepo.countInvestigadoresActivos()).thenReturn(1L);
        when(invRepo.count()).thenReturn(2L);
        when(rolUsuarioRepo.countPersonalAdministrativo()).thenReturn(3L);
        when(proyRepo.count()).thenReturn(4L);
        when(invProyRepo.countInvestigadoresAsignados()).thenReturn(5L);
        when(certRepo.countByFechaExpiracionBetween(any(), any())).thenReturn(6);

        DirectorResumenDTO dto = service.get(0); // o -5

        assertEquals(6, dto.certsPorVencer());
        assertEquals(1L, dto.investigadoresActivos());
        assertEquals(2L, dto.totalInvestigadores());
        assertEquals(3L, dto.personalAdministrativo());
        assertEquals(4L, dto.totalProyectos());
        assertEquals(5L, dto.investigadoresAsignados());

        ArgumentCaptor<LocalDate> fromCap = ArgumentCaptor.forClass(LocalDate.class);
        ArgumentCaptor<LocalDate> toCap = ArgumentCaptor.forClass(LocalDate.class);
        verify(certRepo).countByFechaExpiracionBetween(fromCap.capture(), toCap.capture());
        assertEquals(fromCap.getValue().plusDays(30), toCap.getValue());
    }
}

package org.example.backend_cices_system.service;

import org.example.backend_cices_system.report.dao.RepPersonaUsuariaRepository;
import org.example.backend_cices_system.report.dto.PersonaUsuariaDTO;
import org.example.backend_cices_system.report.serviceVw.RepPersonaUsuariaService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RepPersonaUsuariaServiceTest {

    @Mock
    private RepPersonaUsuariaRepository personaRepo;

    @InjectMocks
    private RepPersonaUsuariaService service;

    // =========================================
    // HU-010
    // Debe retornar solo asistentes y administrativos
    // =========================================
    @Test
    void HU10_debeRetornarSoloAsistentesYAdministrativos() {

        RepPersonaUsuaria r1 = mock(RepPersonaUsuaria.class);
        when(r1.getNombreRol()).thenReturn("ASISTENTE");
        when(r1.getIdentificacion()).thenReturn("1");
        when(r1.getNombreCompleto()).thenReturn("Alejandro");
        when(r1.getPais()).thenReturn("CR");
        when(r1.getCorreo()).thenReturn("a@gmail.com");
        when(r1.getNumeroTelefono()).thenReturn("8888");
        when(r1.getGradoAcademico()).thenReturn("Lic");

        RepPersonaUsuaria r2 = mock(RepPersonaUsuaria.class);
        when(r2.getNombreRol()).thenReturn("ADMINISTRATIVO");
        when(r2.getIdentificacion()).thenReturn("2");
        when(r2.getNombreCompleto()).thenReturn("Maria");
        when(r2.getPais()).thenReturn("CR");
        when(r2.getCorreo()).thenReturn("m@gmail.com");
        when(r2.getNumeroTelefono()).thenReturn("7777");
        when(r2.getGradoAcademico()).thenReturn("Maestría");

        RepPersonaUsuaria r3 = mock(RepPersonaUsuaria.class);
        when(r3.getNombreRol()).thenReturn("INVESTIGADOR");

        when(personaRepo.findAll()).thenReturn(List.of(r1, r2, r3));

        List<PersonaUsuariaDTO> resultado =
                service.obtenerAsistentesAdministrativos();

        assertEquals(2, resultado.size());
    }

    // =========================================
    // HU-010
    // Debe agrupar por identificación y acumular roles
    // =========================================
    @Test
    void HU10_debeAgruparPorIdentificacionYAcumularRoles() {

        RepPersonaUsuaria r1 = mock(RepPersonaUsuaria.class);
        when(r1.getNombreRol()).thenReturn("ASISTENTE");
        when(r1.getIdentificacion()).thenReturn("1");
        when(r1.getNombreCompleto()).thenReturn("Alejandro");
        when(r1.getPais()).thenReturn("CR");
        when(r1.getCorreo()).thenReturn("a@gmail.com");
        when(r1.getNumeroTelefono()).thenReturn("8888");
        when(r1.getGradoAcademico()).thenReturn("Lic");

        RepPersonaUsuaria r2 = mock(RepPersonaUsuaria.class);
        when(r2.getNombreRol()).thenReturn("ADMINISTRATIVO");
        when(r2.getIdentificacion()).thenReturn("1");

        when(personaRepo.findAll()).thenReturn(List.of(r1, r2));

        List<PersonaUsuariaDTO> resultado =
                service.obtenerAsistentesAdministrativos();

        assertEquals(1, resultado.size());
        assertEquals(2, resultado.get(0).roles().size());
    }

    // =========================================
    // HU-010
    // Debe retornar lista vacía si no hay roles válidos
    // =========================================
    @Test
    void HU10_debeRetornarListaVaciaSiNoHayRolesPermitidos() {

        RepPersonaUsuaria r1 = mock(RepPersonaUsuaria.class);
        when(r1.getNombreRol()).thenReturn("INVESTIGADOR");

        when(personaRepo.findAll()).thenReturn(List.of(r1));

        List<PersonaUsuariaDTO> resultado =
                service.obtenerAsistentesAdministrativos();

        assertTrue(resultado.isEmpty());
    }
}
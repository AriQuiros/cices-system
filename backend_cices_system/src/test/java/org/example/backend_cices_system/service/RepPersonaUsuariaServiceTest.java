package org.example.backend_cices_system.service;

import org.example.backend_cices_system.report.dao.RepPersonaUsuariaRepository;
import org.example.backend_cices_system.report.dto.InvestigadorConsultaDTO;
import org.example.backend_cices_system.report.dto.PersonaUsuariaDTO;
import org.example.backend_cices_system.report.dto.UsuarioPersonaDTO;
import org.example.backend_cices_system.report.serviceVw.RepPersonaUsuariaService;
import org.example.backend_cices_system.report.view.RepPersonaUsuaria;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class RepPersonaUsuariaServiceTest {

    @Mock
    private RepPersonaUsuariaRepository personaRepo;

    @InjectMocks
    private RepPersonaUsuariaService service;

    @Test
    void obtenerAsistentesAdministrativos_debeTraerSoloAsistenteYAdministrativo() {
        RepPersonaUsuaria rep1 = mock(RepPersonaUsuaria.class);
        when(rep1.getNombreRol()).thenReturn("ASISTENTE");
        when(rep1.getIdentificacion()).thenReturn("111");
        when(rep1.getNombreCompleto()).thenReturn("Ana Perez");
        when(rep1.getPais()).thenReturn("Costa Rica");
        when(rep1.getCorreo()).thenReturn("ana@mail.com");
        when(rep1.getNumeroTelefono()).thenReturn("8888");
        when(rep1.getGradoAcademico()).thenReturn("Licenciatura");

        RepPersonaUsuaria rep2 = mock(RepPersonaUsuaria.class);
        when(rep2.getNombreRol()).thenReturn("ADMINISTRATIVO");
        when(rep2.getIdentificacion()).thenReturn("111");
        when(rep2.getNombreCompleto()).thenReturn("Ana Perez");
        when(rep2.getPais()).thenReturn("Costa Rica");
        when(rep2.getCorreo()).thenReturn("ana@mail.com");
        when(rep2.getNumeroTelefono()).thenReturn("8888");
        when(rep2.getGradoAcademico()).thenReturn("Licenciatura");

        RepPersonaUsuaria rep3 = mock(RepPersonaUsuaria.class);
        when(rep3.getNombreRol()).thenReturn("DIRECTOR");

        when(personaRepo.findAll()).thenReturn(List.of(rep1, rep2, rep3));

        List<PersonaUsuariaDTO> resultado = service.obtenerAsistentesAdministrativos();

        assertEquals(1, resultado.size());
        PersonaUsuariaDTO persona = resultado.get(0);
        assertEquals("Ana Perez", persona.nombreCompleto());
        assertEquals("111", persona.identificacion());
        assertTrue(persona.roles().contains("ASISTENTE"));
        assertTrue(persona.roles().contains("ADMINISTRATIVO"));
    }

    @Test
    void todosUsuarios_debeTraerUsuariosAgrupadosConSusRoles() {
        RepPersonaUsuaria rep1 = mock(RepPersonaUsuaria.class);
        when(rep1.getIdentificacion()).thenReturn("111");
        when(rep1.getIdUsuario()).thenReturn(1);
        when(rep1.getNombreCompleto()).thenReturn("Ana Perez");
        when(rep1.getNombreUsuario()).thenReturn("aperez");
        when(rep1.getActivo()).thenReturn(true);
        when(rep1.getNombreRol()).thenReturn("ASISTENTE");

        RepPersonaUsuaria rep2 = mock(RepPersonaUsuaria.class);
        when(rep2.getIdentificacion()).thenReturn("111");
        when(rep2.getNombreRol()).thenReturn("ADMINISTRATIVO");

        RepPersonaUsuaria rep3 = mock(RepPersonaUsuaria.class);
        when(rep3.getIdentificacion()).thenReturn("222");
        when(rep3.getIdUsuario()).thenReturn(2);
        when(rep3.getNombreCompleto()).thenReturn("Luis Mora");
        when(rep3.getNombreUsuario()).thenReturn("lmora");
        when(rep3.getActivo()).thenReturn(false);
        when(rep3.getNombreRol()).thenReturn("DIRECTOR");

        when(personaRepo.findAll()).thenReturn(List.of(rep1, rep2, rep3));

        List<UsuarioPersonaDTO> resultado = service.todosUsuarios();

        assertEquals(2, resultado.size());

        UsuarioPersonaDTO ana = resultado.stream()
                .filter(u -> u.nombreUsuario().equals("aperez"))
                .findFirst()
                .orElseThrow();

        assertEquals(1, ana.id());
        assertEquals("Ana Perez", ana.nombreCompleto());
        assertTrue(ana.activo());
        assertTrue(ana.roles().contains("ASISTENTE"));
        assertTrue(ana.roles().contains("ADMINISTRATIVO"));
    }

    @Test
    void obtenerInvestigadores_debeTraerInvestigadoresSinDuplicadosPorIdentificacion() {
        RepPersonaUsuaria rep1 = mock(RepPersonaUsuaria.class);
        when(rep1.getIdentificacion()).thenReturn("111");
        when(rep1.getNombreCompleto()).thenReturn("Ana Perez");
        when(rep1.getPais()).thenReturn("Costa Rica");
        when(rep1.getCorreo()).thenReturn("ana@mail.com");
        when(rep1.getNumeroTelefono()).thenReturn("8888");
        when(rep1.getGradoAcademico()).thenReturn("Licenciatura");
        when(rep1.getInstitucionOrigen()).thenReturn("UNA");
        when(rep1.getUnidadAcademica()).thenReturn("Informatica");
        when(rep1.getTemaInteres()).thenReturn("IA");

        RepPersonaUsuaria rep2 = mock(RepPersonaUsuaria.class);
        when(rep2.getIdentificacion()).thenReturn("111");

        RepPersonaUsuaria rep3 = mock(RepPersonaUsuaria.class);
        when(rep3.getIdentificacion()).thenReturn("222");
        when(rep3.getNombreCompleto()).thenReturn("Luis Mora");
        when(rep3.getPais()).thenReturn("Costa Rica");
        when(rep3.getCorreo()).thenReturn("luis@mail.com");
        when(rep3.getNumeroTelefono()).thenReturn("9999");
        when(rep3.getGradoAcademico()).thenReturn("Maestria");
        when(rep3.getInstitucionOrigen()).thenReturn("TEC");
        when(rep3.getUnidadAcademica()).thenReturn("Computacion");
        when(rep3.getTemaInteres()).thenReturn("Datos");

        when(personaRepo.findAll()).thenReturn(List.of(rep1, rep2, rep3));

        List<InvestigadorConsultaDTO> resultado = service.obtenerInvestigadores();

        assertEquals(2, resultado.size());
    }
}
package org.example.backend_cices_system.report.controller;

import org.example.backend_cices_system.report.dto.InvestigadorConsultaDTO;
import org.example.backend_cices_system.report.dto.PersonaUsuariaDTO;
import org.example.backend_cices_system.report.dto.UsuarioPersonaDTO;
import org.example.backend_cices_system.report.serviceVw.RepPersonaUsuariaService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RepPersonaUsuariaControllerTest {

    @Mock
    private RepPersonaUsuariaService personaService;

    @InjectMocks
    private RepPersonaUsuariaController controller;

    @Test
    void obtenerEmpleados_debeRetornarListaDeEmpleados() {
        List<PersonaUsuariaDTO> mockLista = List.of(
                new PersonaUsuariaDTO(
                        "Ana Perez",
                        "111",
                        "Costa Rica",
                        "ana@mail.com",
                        "8888",
                        "Licenciatura",
                        List.of("ASISTENTE", "ADMINISTRATIVO")
                )
        );

        when(personaService.obtenerAsistentesAdministrativos()).thenReturn(mockLista);

        List<PersonaUsuariaDTO> resultado = controller.obtenerEmpleados();

        assertEquals(1, resultado.size());
        assertEquals("Ana Perez", resultado.get(0).nombreCompleto());
        assertEquals("111", resultado.get(0).identificacion());
        verify(personaService).obtenerAsistentesAdministrativos();
    }

    @Test
    void obtenerInvestigadores_debeRetornarListaDeInvestigadores() {
        List<InvestigadorConsultaDTO> mockLista = List.of(
                new InvestigadorConsultaDTO(
                        "Luis Mora",
                        "222",
                        "Costa Rica",
                        "luis@mail.com",
                        "9999",
                        "Maestria",
                        "TEC",
                        "Computacion",
                        "Datos"
                )
        );

        when(personaService.obtenerInvestigadores()).thenReturn(mockLista);

        List<InvestigadorConsultaDTO> resultado = controller.obtenerInvestigadores();

        assertEquals(1, resultado.size());
        assertEquals("Luis Mora", resultado.get(0).nombreCompleto());
        assertEquals("222", resultado.get(0).identificacion());
        verify(personaService).obtenerInvestigadores();
    }

    @Test
    void obtenerUsuarios_debeRetornarListaDeUsuarios() {
        List<UsuarioPersonaDTO> mockLista = List.of(
                new UsuarioPersonaDTO(
                        1,
                        "Ana Perez",
                        "aperez",
                        true,
                        List.of("DIRECTOR")
                )
        );

        when(personaService.todosUsuarios()).thenReturn(mockLista);

        List<UsuarioPersonaDTO> resultado = controller.obtenerUsuarios();

        assertEquals(1, resultado.size());
        assertEquals("Ana Perez", resultado.get(0).nombreCompleto());
        assertEquals("aperez", resultado.get(0).nombreUsuario());
        assertEquals(true, resultado.get(0).activo());
        verify(personaService).todosUsuarios();
    }
}
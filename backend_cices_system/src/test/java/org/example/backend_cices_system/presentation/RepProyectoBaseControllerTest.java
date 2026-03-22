package org.example.backend_cices_system.presentation;

import org.example.backend_cices_system.logic.Usuario;
import org.example.backend_cices_system.report.controller.RepProyectoBaseController;
import org.example.backend_cices_system.report.serviceVw.RepPersonaUsuariaService;
import org.example.backend_cices_system.report.serviceVw.RepProyectoBaseService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RepProyectoBaseControllerTest {

    @Mock
    private RepProyectoBaseService service;

    @Mock
    private RepPersonaUsuariaService personaService;

    @InjectMocks
    private RepProyectoBaseController controller;

    @Test
    void testGetAll() {

        when(service.proyectosListado()).thenReturn(List.of());

        ResponseEntity<?> response = controller.getAll();

        assertEquals(200, response.getStatusCodeValue());
        verify(service).proyectosListado();
    }

    @Test
    void testObtenerProyectosInvestigador() {

        Usuario user = new Usuario();
        user.setId(1);

        Authentication auth = mock(Authentication.class);
        when(auth.getPrincipal()).thenReturn(user);

        when(personaService.idInvestigadorPorUsuario(1)).thenReturn(10);
        when(service.obtenerProyectosInvestigador(10)).thenReturn(List.of());

        List<?> result = controller.obtenerProyectos_Investigador(auth);

        assertNotNull(result);

        verify(personaService).idInvestigadorPorUsuario(1);
        verify(service).obtenerProyectosInvestigador(10);
    }
}

package org.example.backend_cices_system.presentation;

import org.example.backend_cices_system.logic.Usuario;
import org.example.backend_cices_system.report.controller.RepInvestigadorProyectoController;
import org.example.backend_cices_system.report.controller.RepProyectoBaseController;
import org.example.backend_cices_system.report.serviceVw.RepInvestigadorProyectoService;
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
/*
@ExtendWith(MockitoExtension.class)
class RepProyectoBaseControllerTest {

    @Mock
    private RepInvestigadorProyectoService investigadorProyectoService;

    @InjectMocks
    private RepInvestigadorProyectoController controller;

    @Test
    void testObtenerProyectosInvestigador() {

        Usuario user = new Usuario();
        user.setId(1);

        Authentication auth = mock(Authentication.class);
        when(auth.getPrincipal()).thenReturn(user);

        when(investigadorProyectoService.obtenerIdInvestigador(1)).thenReturn(10);
        when(investigadorProyectoService.obtenerProyectosInvestigador(10)).thenReturn(List.of());

        List<?> result = controller.obtenerProyectos_Investigador(auth);

        assertNotNull(result);

        verify(investigadorProyectoService).obtenerIdInvestigador(10);
        verify(investigadorProyectoService).obtenerProyectosInvestigador(10);
    }
}*/

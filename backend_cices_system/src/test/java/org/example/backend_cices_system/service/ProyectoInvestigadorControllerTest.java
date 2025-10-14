package org.example.backend_cices_system.service;

import org.example.backend_cices_system.dto.ProyectoDTO;
import org.example.backend_cices_system.presentation.InvestigadorController;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProyectoInvestigadorControllerTest {

    @Mock InvestigadorService service;
    @InjectMocks InvestigadorController controller;

    @Test
    void misProyectos_ok_200_conLista() {
        Authentication auth = mock(Authentication.class);
        when(auth.getName()).thenReturn("invest1");
        when(service.misProyectos("invest1")).thenReturn(List.of(new ProyectoDTO()));

        var resp = controller.misProyectos(auth);

        assertEquals(200, resp.getStatusCode().value());
    }

    @Test
    void misProyectos_noEsInvestigador_200_listaVacia() {
        Authentication auth = mock(Authentication.class);
        when(auth.getName()).thenReturn("noInv");
        when(service.misProyectos("noInv")).thenThrow(new RuntimeException("No es investigador"));

        var resp = controller.misProyectos(auth);

        assertEquals(200, resp.getStatusCode().value());
    }

    @Test
    void misProyectos_errorGenerico_500_conMensaje() {
        Authentication auth = mock(Authentication.class);
        when(auth.getName()).thenReturn("invest1");
        when(service.misProyectos("invest1")).thenThrow(new RuntimeException("Fallo interno"));

        var resp = controller.misProyectos(auth);

        assertEquals(500, resp.getStatusCode().value());
    }
}


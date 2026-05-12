package org.example.backend_cices_system.presentation;

import org.example.backend_cices_system.dto.RolDTO;
import org.example.backend_cices_system.service.RolService;
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
class RolControllerTest {

    @Mock
    private RolService rolService;

    @InjectMocks
    private RolController controller;

    @Test
    void obtenerNombreRoles_debeRetornarListaDeRoles() {
        List<RolDTO> mockLista = List.of(
                new RolDTO((short) 1, "DIRECTOR"),
                new RolDTO((short) 2, "ASISTENTE")
        );

        when(rolService.obtenerRolesDTO()).thenReturn(mockLista);

        List<RolDTO> resultado = controller.obtenerNombreRoles();

        assertEquals(2, resultado.size());
        assertEquals("DIRECTOR", resultado.get(0).nombreRol());
        assertEquals("ASISTENTE", resultado.get(1).nombreRol());
        verify(rolService).obtenerRolesDTO();
    }
}
package org.example.backend_cices_system.presentation;

import org.example.backend_cices_system.report.controller.RepPersonaUsuariaController;
import org.example.backend_cices_system.report.dto.PersonaUsuariaDTO;
import org.example.backend_cices_system.report.serviceVw.RepPersonaUsuariaService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RepPersonaUsuariaControllerTest {

    @Mock
    private RepPersonaUsuariaService personaService;

    @InjectMocks
    private RepPersonaUsuariaController controller;

    // =========================================
    // HU-010
    // Debe retornar lista de empleados para supervisión
    // =========================================
    @Test
    void HU10_controllerDebeRetornarListaDeEmpleados() {

        List<PersonaUsuariaDTO> lista = List.of(
                new PersonaUsuariaDTO(
                        "Alejandro",
                        "1",
                        "CR",
                        "a@gmail.com",
                        "8888",
                        "Lic",
                        List.of("ASISTENTE")
                ),
                new PersonaUsuariaDTO(
                        "Maria",
                        "2",
                        "CR",
                        "m@gmail.com",
                        "7777",
                        "Maestría",
                        List.of("ADMINISTRATIVO")
                )
        );

        Page<PersonaUsuariaDTO> pageMock =
                new PageImpl<>(lista);

        when(personaService.obtenerPersonaPorRoles(
                any(),
                any(),
                any()
        )).thenReturn(pageMock);

        Page<PersonaUsuariaDTO> resultado =
                controller.obtenerEmpleados(null, Pageable.unpaged());

        assertEquals(2, resultado.getContent().size());
    }

    // =========================================
    // HU-010
    // Debe retornar lista vacía si no existen empleados válidos
    // =========================================
    @Test
    void HU10_controllerDebeRetornarListaVacia() {

        Page<PersonaUsuariaDTO> pageMock =
                new PageImpl<>(List.of());

        when(personaService.obtenerPersonaPorRoles(
                any(),
                any(),
                any()
        )).thenReturn(pageMock);

        Page<PersonaUsuariaDTO> resultado =
                controller.obtenerEmpleados(null, Pageable.unpaged());

        assertTrue(resultado.getContent().isEmpty());
    }
}
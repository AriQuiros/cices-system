package org.example.backend_cices_system.service;

import org.example.backend_cices_system.data.RolRepository;
import org.example.backend_cices_system.dto.RolDTO;
import org.example.backend_cices_system.logic.Rol;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RolServiceTest {

    @Mock
    private RolRepository rolRepository;

    @InjectMocks
    private RolService rolService;

    @Test
    void obtenerRolesDTO_debeTraerLosRolesCorrectamente() {
        Rol rol1 = new Rol();
        rol1.setId((short) 1);
        rol1.setNombreRol("DIRECTOR");

        Rol rol2 = new Rol();
        rol2.setId((short) 2);
        rol2.setNombreRol("ASISTENTE");

        when(rolRepository.findAll()).thenReturn(List.of(rol1, rol2));

        List<RolDTO> resultado = rolService.obtenerRolesDTO();

        assertEquals(2, resultado.size());
        assertEquals((short) 1, resultado.get(0).id());
        assertEquals("DIRECTOR", resultado.get(0).nombreRol());
        assertEquals((short) 2, resultado.get(1).id());
        assertEquals("ASISTENTE", resultado.get(1).nombreRol());
    }
}
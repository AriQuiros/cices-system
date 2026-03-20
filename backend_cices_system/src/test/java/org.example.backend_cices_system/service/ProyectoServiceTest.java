package org.example.backend_cices_system.service;

import org.example.backend_cices_system.dto.ResumenHorasProyectoDTO;
import org.example.backend_cices_system.logic.Proyecto;
import org.example.backend_cices_system.data.HorasAsignadasRepository;
import org.example.backend_cices_system.data.ProyectoRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProyectoServiceTest {

    @Mock
    private ProyectoRepository proyectoRepository;

    @Mock
    private HorasAsignadasRepository horasRepository;

    @InjectMocks
    private ProyectoService proyectoService;

    @Test
    void debeRetornarResumenHorasCorrectamente() {

        Proyecto proyecto = new Proyecto();
        proyecto.setId(1);
        proyecto.setNombreProyecto("Proyecto CICES");

        List<Object[]> filas = List.of(
                new Object[]{1, "Alejandro Alvarez", "Carga académica", 10.0, (short) 6},
                new Object[]{2, "Maria Gomez", "Asistente", 5.0, (short) 4}
        );

        when(proyectoRepository.findById(1)).thenReturn(Optional.of(proyecto));
        when(horasRepository.obtenerHorasAsignadasProyecto(1)).thenReturn(filas);
        when(horasRepository.totalHorasAsignadas(1)).thenReturn(80.0);
        when(horasRepository.totalHorasPresupuestadas(1)).thenReturn(100.0);

        ResumenHorasProyectoDTO resultado = proyectoService.obtenerResumenHoras(1);

        assertNotNull(resultado);
        assertEquals("Proyecto CICES", resultado.proyectoNombre());
        assertEquals(80.0, resultado.totalHorasAsignadas());
        assertEquals(20.0, resultado.totalHorasDisponibles());

        assertEquals(2, resultado.investigadores().size());

        assertEquals(1, resultado.investigadores().get(0).idInvestigador());
        assertEquals("Alejandro Alvarez", resultado.investigadores().get(0).nombreCompleto());
        assertEquals("Carga académica", resultado.investigadores().get(0).tipoHoras());
        assertEquals(10.0, resultado.investigadores().get(0).horasMes());

        // 🔥 CORRECCIÓN IMPORTANTE
        assertTrue(resultado.investigadores().get(0).meses().describeConstable().isPresent());
        assertEquals((short) 6, resultado.investigadores().get(0).meses());

        assertEquals(2, resultado.investigadores().get(1).idInvestigador());
        assertEquals("Maria Gomez", resultado.investigadores().get(1).nombreCompleto());
    }

    @Test
    void debeRetornarListaVaciaCuandoNoHayHorasAsignadas() {

        Proyecto proyecto = new Proyecto();
        proyecto.setId(1);
        proyecto.setNombreProyecto("Proyecto vacío");

        when(proyectoRepository.findById(1)).thenReturn(Optional.of(proyecto));
        when(horasRepository.obtenerHorasAsignadasProyecto(1)).thenReturn(List.of());
        when(horasRepository.totalHorasAsignadas(1)).thenReturn(0.0);
        when(horasRepository.totalHorasPresupuestadas(1)).thenReturn(50.0);

        ResumenHorasProyectoDTO resultado = proyectoService.obtenerResumenHoras(1);

        assertNotNull(resultado);
        assertEquals("Proyecto vacío", resultado.proyectoNombre());
        assertEquals(0.0, resultado.totalHorasAsignadas());
        assertEquals(50.0, resultado.totalHorasDisponibles());
        assertTrue(resultado.investigadores().isEmpty());
    }

    @Test
    void debeLanzarExcepcionCuandoProyectoNoExiste() {

        when(proyectoRepository.findById(1)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class,
                () -> proyectoService.obtenerResumenHoras(1));
    }
}
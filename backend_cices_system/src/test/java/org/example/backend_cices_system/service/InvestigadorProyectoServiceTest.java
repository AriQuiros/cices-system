package org.example.backend_cices_system.service;

import org.example.backend_cices_system.data.InvestigadorProyectoRepository;
import org.example.backend_cices_system.dto.InvestigadorProyectoDTO;
import org.example.backend_cices_system.dto.RolProyectoDTO;
import org.example.backend_cices_system.logic.Empleado;
import org.example.backend_cices_system.logic.Investigador;
import org.example.backend_cices_system.logic.InvestigadorProyecto;
import org.example.backend_cices_system.logic.Proyecto;
import org.example.backend_cices_system.logic.RolProyecto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class InvestigadorProyectoServiceTest {

    @Mock
    private InvestigadorProyectoRepository investigadorProyectoRepository;

    @Mock
    private RolProyectoService rolProyectoService;

    @InjectMocks
    private InvestigadorProyectoService investigadorProyectoService;

    private InvestigadorProyectoDTO dto;
    private Investigador investigador;
    private Proyecto proyecto;
    private RolProyecto rolProyecto;
    private InvestigadorProyecto investigadorProyecto;

    @BeforeEach
    void setUp() {
        dto = new InvestigadorProyectoDTO(
                10,
                "123456789",
                "Ana Rodríguez",
                "bachi",
                "PR-001",
                new RolProyectoDTO((short) 2, "Colaborador"),
                "Trabajo de campo",
                LocalDate.of(2025, 2, 1),
                LocalDate.of(2025, 6, 30)
        );

        Empleado empleado = new Empleado();
        empleado.setIdentificacion("123456789");
        empleado.setNombreCompleto("Ana Rodríguez");

        investigador = new Investigador();
        investigador.setIdEmpleado(empleado);

        proyecto = new Proyecto();
        proyecto.setCodigoProyecto("PR-001");

        rolProyecto = new RolProyecto();
        rolProyecto.setId((short) 2);
        rolProyecto.setNombreRolProyecto("Colaborador");

        investigadorProyecto = new InvestigadorProyecto();
        investigadorProyecto.setId(10);
        investigadorProyecto.setIdInvestigador(investigador);
        investigadorProyecto.setIdProyecto(proyecto);
        investigadorProyecto.setIdRolProyecto(rolProyecto);
        investigadorProyecto.setActividadProyecto("Trabajo de campo");
        investigadorProyecto.setFechaInicioInvestigador(LocalDate.of(2025, 2, 1));
        investigadorProyecto.setFechaFinInvestigador(LocalDate.of(2025, 6, 30));
    }

    @Test
    void guardarInvestigadorProyecto_deberiaGuardarYRetornarDto() {
        when(rolProyectoService.obtenerRolProyecto((short) 2)).thenReturn(rolProyecto);

        InvestigadorProyectoDTO resultado =
                investigadorProyectoService.guardarInvestigadorProyecto(dto, investigador, proyecto);

        assertNotNull(resultado);
        assertEquals(dto, resultado);

        ArgumentCaptor<InvestigadorProyecto> captor =
                ArgumentCaptor.forClass(InvestigadorProyecto.class);

        verify(investigadorProyectoRepository).save(captor.capture());

        InvestigadorProyecto guardado = captor.getValue();
        assertEquals(investigador, guardado.getIdInvestigador());
        assertEquals(proyecto, guardado.getIdProyecto());
        assertEquals(rolProyecto, guardado.getIdRolProyecto());
        assertEquals("Trabajo de campo", guardado.getActividadProyecto());
        assertEquals(LocalDate.of(2025, 2, 1), guardado.getFechaInicioInvestigador());
        assertEquals(LocalDate.of(2025, 6, 30), guardado.getFechaFinInvestigador());

        verify(rolProyectoService).obtenerRolProyecto((short) 2);
    }

    @Test
    void actualizarInvestigadorProyecto_deberiaActualizarYRetornarDto() {
        RolProyecto nuevoRol = new RolProyecto();
        nuevoRol.setId((short) 3);
        nuevoRol.setNombreRolProyecto("Asistente");

        InvestigadorProyectoDTO dtoActualizado = new InvestigadorProyectoDTO(
                10,
                "123456789",
                "Ana Rodríguez",
                "Bachi",
                "PR-001",
                new RolProyectoDTO((short) 3, "Asistente"),
                "Trabajo actualizado",
                LocalDate.of(2025, 3, 1),
                LocalDate.of(2025, 8, 31)
        );

        when(investigadorProyectoRepository.findById(10)).thenReturn(Optional.of(investigadorProyecto));
        when(rolProyectoService.obtenerRolProyecto((short) 3)).thenReturn(nuevoRol);

        InvestigadorProyectoDTO resultado =
                investigadorProyectoService.actualizarInvestigadorProyecto(dtoActualizado);

        assertNotNull(resultado);
        assertEquals(dtoActualizado, resultado);

        assertEquals("Trabajo actualizado", investigadorProyecto.getActividadProyecto());
        assertEquals(nuevoRol, investigadorProyecto.getIdRolProyecto());
        assertEquals(LocalDate.of(2025, 3, 1), investigadorProyecto.getFechaInicioInvestigador());
        assertEquals(LocalDate.of(2025, 8, 31), investigadorProyecto.getFechaFinInvestigador());

        verify(investigadorProyectoRepository).save(investigadorProyecto);
        verify(rolProyectoService).obtenerRolProyecto((short) 3);
    }

    @Test
    void eliminarInvestigadorProyecto_deberiaEliminarYRetornarDto() {
        when(investigadorProyectoRepository.findById(10)).thenReturn(Optional.of(investigadorProyecto));

        InvestigadorProyectoDTO resultado =
                investigadorProyectoService.eliminarInvestigadorProyecto(10);

        assertNotNull(resultado);
        assertEquals(10, resultado.id());
        assertEquals("123456789", resultado.identificacionInvestigador());
        assertEquals("Ana Rodríguez", resultado.nombreInvestigador());
        assertEquals("PR-001", resultado.codigoProyecto());
        assertEquals("Trabajo de campo", resultado.actividadProyecto());
        assertEquals((short) 2, resultado.rolProyecto().id());
        assertEquals("Colaborador", resultado.rolProyecto().nombreRolProyecto());

        verify(investigadorProyectoRepository).deleteById(10);
    }

    @Test
    void obtenerDTO_deberiaMapearCorrectamente() {
        InvestigadorProyectoDTO resultado = investigadorProyectoService.obtenerDTO(investigadorProyecto);

        assertNotNull(resultado);
        assertEquals(10, resultado.id());
        assertEquals("123456789", resultado.identificacionInvestigador());
        assertEquals("Ana Rodríguez", resultado.nombreInvestigador());
        assertEquals("PR-001", resultado.codigoProyecto());
        assertEquals("Trabajo de campo", resultado.actividadProyecto());
        assertEquals(LocalDate.of(2025, 2, 1), resultado.fechaInicio());
        assertEquals(LocalDate.of(2025, 6, 30), resultado.fechaFin());
        assertEquals((short) 2, resultado.rolProyecto().id());
        assertEquals("Colaborador", resultado.rolProyecto().nombreRolProyecto());
    }

    @Test
    void obtenerInvestigadorProyecto_porInvestigadorYProyecto_deberiaRetornarEntidad() {
        when(investigadorProyectoRepository.findByIdProyectoAndIdInvestigador(proyecto, investigador))
                .thenReturn(Optional.of(investigadorProyecto));

        InvestigadorProyecto resultado =
                investigadorProyectoService.obtenerInvestigadorProyecto(investigador, proyecto);

        assertNotNull(resultado);
        assertEquals(investigadorProyecto, resultado);
        verify(investigadorProyectoRepository)
                .findByIdProyectoAndIdInvestigador(proyecto, investigador);
    }

    @Test
    void obtenerInvestigadorProyecto_porInvestigadorYProyecto_deberiaLanzarExcepcion_siNoExiste() {
        when(investigadorProyectoRepository.findByIdProyectoAndIdInvestigador(proyecto, investigador))
                .thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> investigadorProyectoService.obtenerInvestigadorProyecto(investigador, proyecto)
        );

        assertTrue(ex.getMessage().contains("InvestigadorProyecto no encontrado"));
    }

    @Test
    void obtenerInvestigadorProyecto_porId_deberiaRetornarEntidad() {
        when(investigadorProyectoRepository.findById(10)).thenReturn(Optional.of(investigadorProyecto));

        InvestigadorProyecto resultado = investigadorProyectoService.obtenerInvestigadorProyecto(10);

        assertNotNull(resultado);
        assertEquals(10, resultado.getId());
        verify(investigadorProyectoRepository).findById(10);
    }

    @Test
    void obtenerInvestigadorProyecto_porId_deberiaLanzarExcepcion_siNoExiste() {
        when(investigadorProyectoRepository.findById(99)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> investigadorProyectoService.obtenerInvestigadorProyecto(99)
        );

        assertTrue(ex.getMessage().contains("InvestigadorProyecto no encontrado"));
        verify(investigadorProyectoRepository).findById(99);
    }
}
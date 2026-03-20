package org.example.backend_cices_system.service;

import org.example.backend_cices_system.data.HorasAsignadasRepository;
import org.example.backend_cices_system.dto.CodigoDTO;
import org.example.backend_cices_system.dto.HorasAsignadasDTO;
import org.example.backend_cices_system.dto.InvestigadorProyectoDTO;
import org.example.backend_cices_system.dto.RolProyectoDTO;
import org.example.backend_cices_system.logic.Empleado;
import org.example.backend_cices_system.logic.HorasAsignada;
import org.example.backend_cices_system.logic.Investigador;
import org.example.backend_cices_system.logic.InvestigadorProyecto;
import org.example.backend_cices_system.logic.Presupuesto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class HorasAsignadasServiceTest {

    @Mock
    private HorasAsignadasRepository horasAsignadasRepository;

    @Mock
    private PresupuestoService presupuestoService;

    @Mock
    private InvestigadorProyectoService investigadorProyectoService;

    @InjectMocks
    private HorasAsignadasService horasAsignadasService;

    private HorasAsignadasDTO dto;
    private InvestigadorProyecto investigadorProyecto;
    private Presupuesto presupuesto;
    private HorasAsignada horaAsignada;

    @BeforeEach
    void setUp() {
        dto = new HorasAsignadasDTO(
                1,
                new InvestigadorProyectoDTO(
                        10,
                        "123456789",
                        "Ana Rodríguez",
                        "PR-001",
                        new RolProyectoDTO((short) 2, "Colaborador"),
                        "Trabajo de campo",
                        LocalDate.of(2025, 2, 1),
                        LocalDate.of(2025, 6, 30)
                ),
                7,
                new CodigoDTO((short) 1, "REGIMEN_TIEMPO", "Régimen por tiempo"),
                new CodigoDTO((short) 2, "ORDINARIAS", "Ordinarias"),
                20.0,
                (short) 2
        );

        investigadorProyecto = new InvestigadorProyecto();
        presupuesto = new Presupuesto();

        horaAsignada = new HorasAsignada();
        horaAsignada.setId(1);
        horaAsignada.setIdInvestigadorProyecto(investigadorProyecto);
        horaAsignada.setIdPresupuesto(presupuesto);
        horaAsignada.setIdCodigoTipoModalidad((short) 1);
        horaAsignada.setCantidadHorasMes(20.0);
        horaAsignada.setCantidadMeses((short) 2);
    }

    @Test
    void obtenerHoraAsignada_deberiaRetornarHora_siExiste() {
        when(horasAsignadasRepository.findById(1)).thenReturn(Optional.of(horaAsignada));

        HorasAsignada resultado = horasAsignadasService.obtenerHoraAsignada(1);

        assertNotNull(resultado);
        assertEquals(1, resultado.getId());
        verify(horasAsignadasRepository).findById(1);
    }

    @Test
    void obtenerHoraAsignada_deberiaLanzarExcepcion_siNoExiste() {
        when(horasAsignadasRepository.findById(99)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> horasAsignadasService.obtenerHoraAsignada(99));

        assertTrue(ex.getMessage().contains("99"));
        verify(horasAsignadasRepository).findById(99);
    }

    @Test
    void guardarHorasAsignadas_deberiaGuardarTodas_yRetornarCantidad() {
        when(investigadorProyectoService.obtenerInvestigadorProyecto(10)).thenReturn(investigadorProyecto);
        when(presupuestoService.obtenerPresupuesto(7)).thenReturn(presupuesto);

        int resultado = horasAsignadasService.guardarHorasAsignadas(List.of(dto));

        assertEquals(1, resultado);

        ArgumentCaptor<HorasAsignada> captor = ArgumentCaptor.forClass(HorasAsignada.class);
        verify(horasAsignadasRepository).save(captor.capture());

        HorasAsignada guardada = captor.getValue();
        assertEquals(investigadorProyecto, guardada.getIdInvestigadorProyecto());
        assertEquals(presupuesto, guardada.getIdPresupuesto());
        assertEquals((short) 1, guardada.getIdCodigoTipoModalidad());
        assertEquals(20.0, guardada.getCantidadHorasMes());
        assertEquals((short) 2, guardada.getCantidadMeses());

        verify(investigadorProyectoService).obtenerInvestigadorProyecto(10);
        verify(presupuestoService).obtenerPresupuesto(7);
    }

    @Test
    void guardarHorasAsignadas_deberiaGuardarMultiplesRegistros() {
        HorasAsignadasDTO dto2 = new HorasAsignadasDTO(
                2,
                new InvestigadorProyectoDTO(
                        11,
                        "987654321",
                        "Luis Pérez",
                        "PR-001",
                        new RolProyectoDTO((short) 3, "Asistente"),
                        "Apoyo",
                        LocalDate.of(2025, 3, 1),
                        LocalDate.of(2025, 7, 31)
                ),
                8,
                new CodigoDTO((short) 1, "REGIMEN_TIEMPO", "Régimen por tiempo"),
                new CodigoDTO((short) 2, "ORDINARIAS", "Ordinarias"),
                10.0,
                (short) 3
        );

        InvestigadorProyecto investigadorProyecto2 = new InvestigadorProyecto();
        Presupuesto presupuesto2 = new Presupuesto();

        when(investigadorProyectoService.obtenerInvestigadorProyecto(10)).thenReturn(investigadorProyecto);
        when(investigadorProyectoService.obtenerInvestigadorProyecto(11)).thenReturn(investigadorProyecto2);
        when(presupuestoService.obtenerPresupuesto(7)).thenReturn(presupuesto);
        when(presupuestoService.obtenerPresupuesto(8)).thenReturn(presupuesto2);

        int resultado = horasAsignadasService.guardarHorasAsignadas(List.of(dto, dto2));

        assertEquals(2, resultado);
        verify(horasAsignadasRepository, times(2)).save(any(HorasAsignada.class));
    }

    @Test
    void actualizarHora_deberiaActualizarCampos_yRetornarDto() {
        when(horasAsignadasRepository.findById(1)).thenReturn(Optional.of(horaAsignada));

        HorasAsignadasDTO resultado = horasAsignadasService.actualizarHora(dto);

        assertNotNull(resultado);
        assertEquals(dto, resultado);
        assertEquals((short) 1, horaAsignada.getIdCodigoTipoModalidad());
        assertEquals(20.0, horaAsignada.getCantidadHorasMes());
        assertEquals((short) 2, horaAsignada.getCantidadMeses());

        verify(horasAsignadasRepository).save(horaAsignada);
    }

    @Test
    void eliminarHora_deberiaEliminarYRetornarNombreInvestigador() {
        Empleado empleado = new Empleado();
        empleado.setNombreCompleto("Ana Rodríguez");

        Investigador investigador = new Investigador();
        investigador.setIdEmpleado(empleado);

        InvestigadorProyecto invProyecto = new InvestigadorProyecto();
        invProyecto.setIdInvestigador(investigador);

        horaAsignada.setIdInvestigadorProyecto(invProyecto);

        when(horasAsignadasRepository.findById(1)).thenReturn(Optional.of(horaAsignada));

        String resultado = horasAsignadasService.eliminarHora(1);

        assertEquals("Ana Rodríguez", resultado);
        verify(horasAsignadasRepository).deleteById(1);
    }

    @Test
    void existInvProyecto_deberiaRetornarTrue_siExiste() {
        when(horasAsignadasRepository.existsByIdInvestigadorProyecto_Id(10)).thenReturn(true);

        boolean resultado = horasAsignadasService.existInvProyecto(10);

        assertTrue(resultado);
        verify(horasAsignadasRepository).existsByIdInvestigadorProyecto_Id(10);
    }

    @Test
    void existInvProyecto_deberiaRetornarFalse_siNoExiste() {
        when(horasAsignadasRepository.existsByIdInvestigadorProyecto_Id(10)).thenReturn(false);

        boolean resultado = horasAsignadasService.existInvProyecto(10);

        assertFalse(resultado);
        verify(horasAsignadasRepository).existsByIdInvestigadorProyecto_Id(10);
    }
}
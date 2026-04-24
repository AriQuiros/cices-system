package org.example.backend_cices_system.service;

import org.example.backend_cices_system.modules.presupuesto.repository.PresupuestoRepository;
import org.example.backend_cices_system.modules.presupuesto.service.PresupuestoService;
import org.example.backend_cices_system.shared.catalogo.CodigoDTO;
import org.example.backend_cices_system.modules.presupuesto.dto.PresupuestoDTO;
import org.example.backend_cices_system.modules.presupuesto.model.Presupuesto;
import org.example.backend_cices_system.modules.proyecto.model.Proyecto;
import org.example.backend_cices_system.shared.catalogo.CatalogoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PresupuestoServiceTest {

    @Mock
    private PresupuestoRepository presupuestoRepository;

    @Mock
    private CatalogoService catalogoService;

    @InjectMocks
    private PresupuestoService presupuestoService;

    private Proyecto proyecto;
    private Presupuesto presupuesto;
    private PresupuestoDTO presupuestoFinancieroDTO;
    private PresupuestoDTO presupuestoHorasDTO;

    @BeforeEach
    void setUp() {
        proyecto = new Proyecto();
        proyecto.setId(1);
        proyecto.setCodigoProyecto("PR-001");

        presupuesto = new Presupuesto();
        presupuesto.setId(10);
        presupuesto.setIdProyecto(proyecto);
        presupuesto.setDescripcion("Presupuesto base");
        presupuesto.setFechaAsignacion(LocalDate.of(2025, 1, 15));
        presupuesto.setIdCodigoTipoCategoria((short) 2);
        presupuesto.setIdCodigoTipoPresupuesto((short) 1);
        presupuesto.setIdCodigoTipoFuenteFinanciamiento((short) 3);
        presupuesto.setMontoAsignado(BigDecimal.valueOf(5000));
        presupuesto.setCantidadHorasMes(BigDecimal.valueOf(20));
        presupuesto.setCantidadMeses((short) 2);

        presupuestoFinancieroDTO = new PresupuestoDTO(
                10,
                "Presupuesto financiero",
                new CodigoDTO((short) 2, "CATEGORIA_A", "Categoría A"),
                LocalDate.of(2025, 1, 15),
                new CodigoDTO((short) 1, "FINANCIERO", "Financiero"),
                new CodigoDTO((short) 3, "ORDINARIO", "Ordinario"),
                BigDecimal.valueOf(5000),
                null,
                null,
                null,
                null
        );

        presupuestoHorasDTO = new PresupuestoDTO(
                11,
                "Presupuesto horas",
                new CodigoDTO((short) 2, "CATEGORIA_B", "Categoría B"),
                LocalDate.of(2025, 2, 1),
                new CodigoDTO((short) 4, "HORAS", "Horas"),
                null,
                null,
                BigDecimal.valueOf(20),
                (short) 2,
                null,
                null
        );
    }

    @Test
    void guardarPresupuesto_deberiaGuardarFinancieroYRetornarCantidad() {
        Integer resultado = presupuestoService.guardarPresupuesto(List.of(presupuestoFinancieroDTO), proyecto);

        assertEquals(1, resultado);

        ArgumentCaptor<Presupuesto> captor = ArgumentCaptor.forClass(Presupuesto.class);
        verify(presupuestoRepository).save(captor.capture());

        Presupuesto guardado = captor.getValue();
        assertEquals(proyecto, guardado.getIdProyecto());
        assertEquals("Presupuesto financiero", guardado.getDescripcion());
        assertEquals(LocalDate.of(2025, 1, 15), guardado.getFechaAsignacion());
        assertEquals((short) 1, guardado.getIdCodigoTipoPresupuesto());
        assertEquals((short) 2, guardado.getIdCodigoTipoCategoria());
        assertEquals((short) 3, guardado.getIdCodigoTipoFuenteFinanciamiento());
        assertEquals(BigDecimal.valueOf(5000), guardado.getMontoAsignado());
    }

    @Test
    void guardarPresupuesto_deberiaGuardarHorasYRetornarCantidad() {
        Integer resultado = presupuestoService.guardarPresupuesto(List.of(presupuestoHorasDTO), proyecto);

        assertEquals(1, resultado);

        ArgumentCaptor<Presupuesto> captor = ArgumentCaptor.forClass(Presupuesto.class);
        verify(presupuestoRepository).save(captor.capture());

        Presupuesto guardado = captor.getValue();
        assertEquals(proyecto, guardado.getIdProyecto());
        assertEquals("Presupuesto horas", guardado.getDescripcion());
        assertEquals(LocalDate.of(2025, 2, 1), guardado.getFechaAsignacion());
        assertEquals((short) 4, guardado.getIdCodigoTipoPresupuesto());
        assertEquals((short) 2, guardado.getIdCodigoTipoCategoria());
        assertEquals(BigDecimal.valueOf(20), guardado.getCantidadHorasMes());
        assertEquals((short) 2, guardado.getCantidadMeses());
    }


    @Test
    void obtenerPresupuestosPorProyecto_deberiaRetornarListaDto() {
        Presupuesto p2 = new Presupuesto();
        p2.setId(20);
        p2.setDescripcion("Otro presupuesto");
        p2.setFechaAsignacion(LocalDate.of(2025, 3, 1));
        p2.setIdCodigoTipoCategoria((short) 5);
        p2.setIdCodigoTipoPresupuesto((short) 4);
        p2.setCantidadHorasMes(BigDecimal.valueOf(15));
        p2.setCantidadMeses((short) 4);

        when(presupuestoRepository.findPresupuestoByIdProyecto(proyecto)).thenReturn(List.of(presupuesto, p2));

        when(catalogoService.obtenerDto((short) 2))
                .thenReturn(new CodigoDTO((short) 2, "CATEGORIA_A", "Categoría A"));
        when(catalogoService.obtenerDto((short) 1))
                .thenReturn(new CodigoDTO((short) 1, "FINANCIERO", "Financiero"));
        when(catalogoService.obtenerDto((short) 3))
                .thenReturn(new CodigoDTO((short) 3, "ORDINARIO", "Ordinario"));
        when(catalogoService.obtenerDto((short) 5))
                .thenReturn(new CodigoDTO((short) 5, "CATEGORIA_B", "Categoría B"));
        when(catalogoService.obtenerDto((short) 4))
                .thenReturn(new CodigoDTO((short) 4, "HORAS", "Horas"));

        List<PresupuestoDTO> resultado = presupuestoService.obtenerPresupuestosPorProyecto(proyecto);

        assertEquals(2, resultado.size());
        assertEquals("Presupuesto base", resultado.get(0).descripcion());
        assertEquals("Otro presupuesto", resultado.get(1).descripcion());
    }

    @Test
    void obtenerDTO_deberiaMapearFinancieroCorrectamente() {
        when(catalogoService.obtenerDto((short) 2))
                .thenReturn(new CodigoDTO((short) 2, "CATEGORIA_A", "Categoría A"));
        when(catalogoService.obtenerDto((short) 1))
                .thenReturn(new CodigoDTO((short) 1, "FINANCIERO", "Financiero"));
        when(catalogoService.obtenerDto((short) 3))
                .thenReturn(new CodigoDTO((short) 3, "ORDINARIO", "Ordinario"));

        PresupuestoDTO resultado = presupuestoService.obtenerDTO(presupuesto);

        assertNotNull(resultado);
        assertEquals(10, resultado.id());
        assertEquals("Presupuesto base", resultado.descripcion());
        assertEquals((short) 2, resultado.categoria().id());
        assertEquals((short) 1, resultado.tipoPresupuesto().id());
        assertEquals((short) 3, resultado.fuenteFinanciamiento().id());
    }

    @Test
    void buscarPresupuestoHorasXProyecto_deberiaRetornarPresupuesto_siExiste() {
        when(catalogoService.codigoXNombreValor("TIPO_PRESUPUESTO", "HORAS")).thenReturn((short) 4);
        when(presupuestoRepository.findByIdProyectoAndIdCodigoTipoPresupuestoAndDescripcion(
                proyecto, (short) 4, "Presupuesto horas"))
                .thenReturn(Optional.of(presupuesto));

        Presupuesto resultado = presupuestoService.buscarPresupuestoHorasXProyecto(proyecto, "Presupuesto horas");

        assertNotNull(resultado);
        assertEquals(presupuesto, resultado);
    }

    @Test
    void buscarPresupuestoHorasXProyecto_deberiaLanzarExcepcion_siNoExiste() {
        when(catalogoService.codigoXNombreValor("TIPO_PRESUPUESTO", "HORAS")).thenReturn((short) 4);
        when(presupuestoRepository.findByIdProyectoAndIdCodigoTipoPresupuestoAndDescripcion(
                proyecto, (short) 4, "No existe"))
                .thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> presupuestoService.buscarPresupuestoHorasXProyecto(proyecto, "No existe")
        );

        assertTrue(ex.getMessage().contains("Presupuesto de horas no encontrado"));
    }

    @Test
    void obtenerPresupuesto_deberiaRetornarPresupuesto_siExiste() {
        when(presupuestoRepository.findById(10)).thenReturn(Optional.of(presupuesto));

        Presupuesto resultado = presupuestoService.obtenerPresupuesto(10);

        assertNotNull(resultado);
        assertEquals(10, resultado.getId());
        verify(presupuestoRepository).findById(10);
    }

    @Test
    void obtenerPresupuesto_deberiaLanzarExcepcion_siNoExiste() {
        when(presupuestoRepository.findById(99)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> presupuestoService.obtenerPresupuesto(99)
        );

        assertTrue(ex.getMessage().contains("Presupuesto no encontrado"));
        verify(presupuestoRepository).findById(99);
    }
}
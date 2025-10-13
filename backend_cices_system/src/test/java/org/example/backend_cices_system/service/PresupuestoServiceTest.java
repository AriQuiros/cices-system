package org.example.backend_cices_system.service;

import org.example.backend_cices_system.data.PresupuestoRepository;
import org.example.backend_cices_system.dto.PresupuestoDTO;
import org.example.backend_cices_system.logic.Presupuesto;
import org.example.backend_cices_system.logic.Proyecto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.mockito.Mockito.*;

class PresupuestoServiceTest {

    @InjectMocks
    private PresupuestoService presupuestoService;

    @Mock
    private PresupuestoRepository presupuestoRepository;

    @Mock
    private CatalogoService catalogoService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGuardarPresupuestosFinanciero() {
        BigDecimal monto = new BigDecimal(100000000);
        // Arrange
        PresupuestoDTO dto = new PresupuestoDTO();
        dto.setTipoPresupuesto("FINANCIERO");
        dto.setFechaAsignacion(LocalDate.of(2025, 10, 1));
        dto.setDescripcion("Presupuesto financiero");
        dto.setFuenteFinanciamiento("ORDINARIO");
        dto.setMonto( monto);

        Proyecto proyecto = new Proyecto();
        proyecto.setId((short) 1);

        // Simular los resultados del catalogoService
        when(catalogoService.obtenerIdCodigoPorTipoYValor("TIPO PRESUPUESTO", "FINANCIERO")).thenReturn((short) 25);
        when(catalogoService.obtenerIdCodigoPorTipoYValor("FUENTE FINANCIAMIENTO", "ORDINARIO")).thenReturn((short) 23);

        // Act
        presupuestoService.guardarPresupuestos(List.of(dto), proyecto);

        // Assert
        ArgumentCaptor<Presupuesto> captor = ArgumentCaptor.forClass(Presupuesto.class);
        verify(presupuestoRepository, times(1)).save(captor.capture());

        Presupuesto saved = captor.getValue();
        assert saved.getIdProyecto().getId() == 1;
        assert saved.getDescripcion().equals("Presupuesto financiero");
        assert saved.getIdCodigoTipoPresupuesto() == 25;
        assert saved.getIdCodigoFuenteFinanciamiento() == 23;
        assert saved.getMonto() == monto;
    }

    @Test
    void testGuardarPresupuestosHoras() {
        // Arrange
        PresupuestoDTO dto = new PresupuestoDTO();
        dto.setTipoPresupuesto("HORAS");
        dto.setFechaAsignacion(LocalDate.of(2025, 10, 1));
        dto.setDescripcion("Presupuesto por horas");
        dto.setCantidadHorasMes(Double.valueOf(160));
        dto.setCantidadMeses(Short.valueOf((short) 6));

        Proyecto proyecto = new Proyecto();
        proyecto.setId((short) 1);

        when(catalogoService.obtenerIdCodigoPorTipoYValor("TIPO PRESUPUESTO", "HORAS")).thenReturn((short) 26);

        // Act
        presupuestoService.guardarPresupuestos(List.of(dto), proyecto);

        // Assert
        ArgumentCaptor<Presupuesto> captor = ArgumentCaptor.forClass(Presupuesto.class);
        verify(presupuestoRepository, times(1)).save(captor.capture());

        Presupuesto saved = captor.getValue();
        assert saved.getIdProyecto().getId() == 1;
        assert saved.getDescripcion().equals("Presupuesto por horas");
        assert saved.getIdCodigoTipoPresupuesto() == 26;
        assert saved.getCantidadHorasMes() == 160;
        assert saved.getCantidadMeses() == 6;
    }

    @Test
    void testGuardarPresupuestosFinancieroYHorasJuntos() {
        // Arrange
        BigDecimal monto = new BigDecimal(50000000);

        // Presupuesto FINANCIERO
        PresupuestoDTO dtoFinanciero = new PresupuestoDTO();
        dtoFinanciero.setTipoPresupuesto("FINANCIERO");
        dtoFinanciero.setFechaAsignacion(LocalDate.of(2025, 10, 1));
        dtoFinanciero.setDescripcion("Presupuesto financiero conjunto");
        dtoFinanciero.setFuenteFinanciamiento("ORDINARIO");
        dtoFinanciero.setMonto(monto);

        // Presupuesto HORAS
        PresupuestoDTO dtoHoras = new PresupuestoDTO();
        dtoHoras.setTipoPresupuesto("HORAS");
        dtoHoras.setFechaAsignacion(LocalDate.of(2025, 10, 2));
        dtoHoras.setDescripcion("Presupuesto por horas conjunto");
        dtoHoras.setCantidadHorasMes(120.0);
        dtoHoras.setCantidadMeses((short) 4);

        Proyecto proyecto = new Proyecto();
        proyecto.setId((short) 2);

        // Simular respuestas del CatalogoService
        when(catalogoService.obtenerIdCodigoPorTipoYValor("TIPO PRESUPUESTO", "FINANCIERO")).thenReturn((short) 25);
        when(catalogoService.obtenerIdCodigoPorTipoYValor("FUENTE FINANCIAMIENTO", "ORDINARIO")).thenReturn((short) 23);
        when(catalogoService.obtenerIdCodigoPorTipoYValor("TIPO PRESUPUESTO", "HORAS")).thenReturn((short) 26);

        // Act
        presupuestoService.guardarPresupuestos(List.of(dtoFinanciero, dtoHoras), proyecto);

        // Assert
        ArgumentCaptor<Presupuesto> captor = ArgumentCaptor.forClass(Presupuesto.class);
        verify(presupuestoRepository, times(2)).save(captor.capture());

        List<Presupuesto> capturados = captor.getAllValues();

        // Verificar el primero (FINANCIERO)
        Presupuesto financiero = capturados.get(0);
        assert financiero.getDescripcion().equals("Presupuesto financiero conjunto");
        assert financiero.getIdCodigoTipoPresupuesto() == 25;
        assert financiero.getIdCodigoFuenteFinanciamiento() == 23;
        assert financiero.getMonto().equals(monto);
        assert financiero.getIdProyecto().getId() == 2;

        // Verificar el segundo (HORAS)
        Presupuesto horas = capturados.get(1);
        assert horas.getDescripcion().equals("Presupuesto por horas conjunto");
        assert horas.getIdCodigoTipoPresupuesto() == 26;
        assert horas.getCantidadHorasMes() == 120.0;
        assert horas.getCantidadMeses() == 4;
        assert horas.getIdCodigoFuenteFinanciamiento() == null;
        assert horas.getMonto() == null;
        assert horas.getIdProyecto().getId() == 2;
    }


}

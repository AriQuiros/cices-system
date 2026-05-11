package org.example.backend_cices_system.service;

import org.example.backend_cices_system.data.GastoRepository;
import org.example.backend_cices_system.dto.GastoDTO;
import org.example.backend_cices_system.logic.Gasto;
import org.example.backend_cices_system.logic.Presupuesto;
import org.example.backend_cices_system.logic.Usuario;
import org.example.backend_cices_system.service.audit.GastoBitService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InOrder;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GastoServiceActualizarTest {

    @Mock
    private GastoRepository gastoRepository;

    @Mock
    private GastoBitService gastoBitService;

    @Mock
    private PresupuestoService presupuestoService;

    @InjectMocks
    private GastoService gastoService;

    @Test
    void actualizarGasto_debeModificarMontoFechaDescripcionYRegistrarBitacora() {
        Presupuesto presupuesto = new Presupuesto();
        presupuesto.setId(501);

        Gasto gastoExistente = new Gasto();
        gastoExistente.setId(9001);
        gastoExistente.setIdPresupuesto(presupuesto);
        gastoExistente.setMonto(new BigDecimal("15000"));
        gastoExistente.setFechaGasto(LocalDate.of(2026, 4, 10));
        gastoExistente.setDescripcion("Compra de reactivos");

        Usuario usuario = new Usuario();
        usuario.setId(11);
        usuario.setNombreUsuario("investigador.principal@ucr.ac.cr");
        usuario.setActivo(true);

        GastoDTO dto = new GastoDTO(
                9001,
                501,
                new BigDecimal("18000"),
                LocalDate.of(2026, 4, 12),
                "Compra de reactivos corregida"
        );

        when(gastoRepository.findById(9001)).thenReturn(Optional.of(gastoExistente));
        when(gastoRepository.save(any(Gasto.class))).thenAnswer(invocation -> invocation.getArgument(0));

        GastoDTO resultado = gastoService.actualizarGasto(dto, usuario);

        ArgumentCaptor<Gasto> gastoCaptor = ArgumentCaptor.forClass(Gasto.class);

        verify(gastoRepository).findById(9001);
        verify(gastoBitService).registrarBitacora(gastoExistente, 11, 'U');
        verify(gastoRepository).save(gastoCaptor.capture());

        Gasto gastoGuardado = gastoCaptor.getValue();

        assertEquals(new BigDecimal("18000"), gastoGuardado.getMonto());
        assertEquals(LocalDate.of(2026, 4, 12), gastoGuardado.getFechaGasto());
        assertEquals("Compra de reactivos corregida", gastoGuardado.getDescripcion());
        assertEquals(501, gastoGuardado.getIdPresupuesto().getId());

        assertEquals(dto, resultado);
    }

    @Test
    void actualizarGasto_debeRegistrarBitacoraAntesDeGuardarCambios() {
        Presupuesto presupuesto = new Presupuesto();
        presupuesto.setId(501);

        Gasto gastoExistente = new Gasto();
        gastoExistente.setId(9001);
        gastoExistente.setIdPresupuesto(presupuesto);
        gastoExistente.setMonto(new BigDecimal("15000"));
        gastoExistente.setFechaGasto(LocalDate.of(2026, 4, 10));
        gastoExistente.setDescripcion("Compra de reactivos");

        Usuario usuario = new Usuario();
        usuario.setId(11);

        GastoDTO dto = new GastoDTO(
                9001,
                501,
                new BigDecimal("18000"),
                LocalDate.of(2026, 4, 12),
                "Compra de reactivos corregida"
        );

        when(gastoRepository.findById(9001)).thenReturn(Optional.of(gastoExistente));
        when(gastoRepository.save(any(Gasto.class))).thenAnswer(invocation -> invocation.getArgument(0));

        gastoService.actualizarGasto(dto, usuario);

        InOrder orden = inOrder(gastoBitService, gastoRepository);

        orden.verify(gastoBitService).registrarBitacora(gastoExistente, 11, 'U');
        orden.verify(gastoRepository).save(gastoExistente);
    }

    @Test
    void actualizarGasto_debeLanzarErrorSiElGastoNoExiste() {
        Usuario usuario = new Usuario();
        usuario.setId(11);

        GastoDTO dto = new GastoDTO(
                9999,
                501,
                new BigDecimal("18000"),
                LocalDate.of(2026, 4, 12),
                "Compra de reactivos corregida"
        );

        when(gastoRepository.findById(9999)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> gastoService.actualizarGasto(dto, usuario)
        );

        assertEquals("Gasto no encontrado para el ID: 9999", exception.getMessage());

        verify(gastoRepository).findById(9999);
        verify(gastoBitService, never()).registrarBitacora(any(), anyInt(), anyChar());
        verify(gastoRepository, never()).save(any(Gasto.class));
    }
}
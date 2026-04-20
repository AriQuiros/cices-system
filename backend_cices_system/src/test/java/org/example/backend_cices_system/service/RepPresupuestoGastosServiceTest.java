package org.example.backend_cices_system.service;
/*
import org.example.backend_cices_system.report.dto.PresupuestoFinancieroDTO;
import org.example.backend_cices_system.report.serviceVw.RepPresupuestoBaseService;
import org.example.backend_cices_system.report.view.RepPresupuestoBase;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RepPresupuestoGastosServiceTest {

    @Mock
    private RepPresupuestoGastosRepository repo;

    @Mock
    private RepPresupuestoBaseService presupuestoBaseService;

    @InjectMocks
    private RepPresupuestoGastosService service;

    @Test
    void testGastosPresupuesto() {

        String codigo = "PROY001";

        // 🔹 Mock de presupuesto base
        RepPresupuestoBase presupuesto = new RepPresupuestoBase();
        presupuesto.setIdPresupuesto(1);
        presupuesto.setCodigoProyecto(codigo);
        presupuesto.setDescripcionPresupuesto("Desc");
        presupuesto.setCategoriaPresupuesto("Cat");
        presupuesto.setMontoAsignado(new BigDecimal("1000.0"));

        when(presupuestoBaseService.buscarPorCodigoProyecto(codigo))
                .thenReturn(List.of(presupuesto));

        // 🔹 Mock de gastos
        RepPresupuestoGastos gasto = new RepPresupuestoGastos();
        gasto.setIdGasto(10);
        gasto.setIdPresupuesto(1);
        gasto.setMontoGasto(new BigDecimal("200.0"));
        gasto.setDescripcionGasto("Compra");

        when(repo.findByIdPresupuesto(1))
                .thenReturn(List.of(gasto));

        // 🔹 Ejecutar
        List<PresupuestoFinancieroDTO> result =
                service.gastosPresupuesto(codigo);

        // 🔹 Validaciones
        assertNotNull(result);
        assertEquals(1, result.size());

        PresupuestoFinancieroDTO dto = result.getFirst();
        assertEquals(codigo, dto.codigoProyecto());
        assertEquals(1, dto.gastos().size());

        // 🔹 Verificar llamadas
        verify(presupuestoBaseService).buscarPorCodigoProyecto(codigo);
        verify(repo).findByIdPresupuesto(1);
    }


}*/
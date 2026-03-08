package org.example.backend_cices_system.service;

import org.example.backend_cices_system.data.GastoRepository;
import org.example.backend_cices_system.dto.GastoDTO;
import org.example.backend_cices_system.logic.Gasto;
import org.example.backend_cices_system.logic.Presupuesto;
import org.springframework.stereotype.Service;

@Service
public class GastoService {
    private final GastoRepository gastoRepository;
    private final PresupuestoService presupuestoService;

    public GastoService(GastoRepository gastoRepository, PresupuestoService presupuestoService) {
        this.gastoRepository = gastoRepository;
        this.presupuestoService = presupuestoService;
    }

    public Gasto guardarGasto(GastoDTO dto, String codigo, String categoria){
        Presupuesto presupuesto = presupuestoService.obtenerPorCodigoYCategoria(codigo, categoria);

        Gasto gasto = new Gasto();
        gasto.setFechaGasto(dto.fecha());
        gasto.setDescripcion(dto.descripcion());
        gasto.setMonto(dto.monto());
        gasto.setIdPresupuesto(presupuesto);

        gastoRepository.save(gasto);
        return gasto;
    }
}

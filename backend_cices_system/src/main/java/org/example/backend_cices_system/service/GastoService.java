package org.example.backend_cices_system.service;

import org.example.backend_cices_system.data.GastoRepository;
import org.example.backend_cices_system.dto.GastoDTO;
import org.example.backend_cices_system.logic.Gasto;
import org.example.backend_cices_system.logic.Presupuesto;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class GastoService {
    private final GastoRepository gastoRepository;
    private final PresupuestoService presupuestoService;

    public GastoService(GastoRepository gastoRepository, PresupuestoService presupuestoService) {
        this.gastoRepository = gastoRepository;
        this.presupuestoService = presupuestoService;
    }

    public List<Gasto> guardarGasto(List<GastoDTO> listDto) {
        List<Gasto> gastosGuardados = new ArrayList<>();

        for (GastoDTO dto : listDto) {
            var presupuesto = presupuestoService.obtenerPresupuesto(dto.idPresupuesto());

            Gasto gasto = new Gasto();
            gasto.setFechaGasto(dto.fechaGasto());
            gasto.setDescripcion(dto.descripcion());
            gasto.setMonto(dto.monto());
            gasto.setIdPresupuesto(presupuesto);

            gastosGuardados.add(gastoRepository.save(gasto));
        }

        return gastosGuardados;
    }

    public GastoDTO actualizarGasto(GastoDTO dto){
        var gasto = obtenerGasto(dto.id());
        gasto.setFechaGasto(dto.fechaGasto());
        gasto.setDescripcion(dto.descripcion());
        gasto.setMonto(dto.monto());

        gastoRepository.save(gasto);
        return dto;
    }

    public GastoDTO eliminarGasto(Integer id){
        var gasto = obtenerGasto(id);
        gastoRepository.deleteById(id);

        return obtenerDTO(gasto);
    }

    public Gasto obtenerGasto(Integer id){
        return gastoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Gasto no encontrado para el ID: " + id));
    }

    public GastoDTO obtenerDTO(Gasto gasto){
        return new GastoDTO(gasto.getId(),null, gasto.getMonto(), gasto.getFechaGasto(), gasto.getDescripcion());
    }
}

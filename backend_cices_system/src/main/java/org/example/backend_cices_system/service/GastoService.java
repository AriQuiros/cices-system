package org.example.backend_cices_system.service;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.data.GastoRepository;
import org.example.backend_cices_system.dto.GastoDTO;
import org.example.backend_cices_system.logic.Gasto;
import org.example.backend_cices_system.logic.Presupuesto;
import org.example.backend_cices_system.logic.Usuario;
import org.example.backend_cices_system.service.audit.GastoBitService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GastoService {
    private final GastoRepository gastoRepository;
    private final GastoBitService gastoBitService;
    private final PresupuestoService presupuestoService;

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

    public GastoDTO actualizarGasto(GastoDTO dto, Usuario usuario){
        var gasto = obtenerGasto(dto.id());
        gastoBitService.registrarBitacora(gasto, usuario.getId(), 'U');

        gasto.setFechaGasto(dto.fechaGasto());
        gasto.setDescripcion(dto.descripcion());
        gasto.setMonto(dto.monto());


        gastoRepository.save(gasto);
        return dto;
    }

    public GastoDTO eliminarGasto(Integer id, Usuario usuario){
        var gasto = obtenerGasto(id);
        gastoBitService.registrarBitacora(gasto, usuario.getId(), 'D');

        gastoRepository.deleteById(id);

        return obtenerDTO(gasto);
    }

    public Gasto obtenerGasto(Integer id){
        return gastoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Gasto no encontrado para el ID: " + id));
    }

    public GastoDTO obtenerDTO(Gasto gasto){
        return new GastoDTO(gasto.getId(), gasto.getId(), gasto.getMonto(), gasto.getFechaGasto(), gasto.getDescripcion());
    }

}

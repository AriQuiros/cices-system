package org.example.backend_cices_system.report.serviceVw;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.report.dao.RepPresupuestoGastosRepository;
import org.example.backend_cices_system.report.dto.GastoPresupuestoDTO;
import org.example.backend_cices_system.report.dto.PresupuestoFinancieroDTO;
import org.example.backend_cices_system.report.view.RepPresupuestoBase;
import org.example.backend_cices_system.report.view.RepPresupuestoGastos;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RepPresupuestoGastosService {

    private final RepPresupuestoGastosRepository repo;
    private final RepPresupuestoBaseService repPresupuestoBaseService;

    public List<RepPresupuestoGastos> obtenerTodos() {
        return repo.findAll();
    }

    public List<RepPresupuestoGastos> buscarPorIdPresupuesto(Integer idPresupuesto) {
        return repo.findByIdPresupuesto(idPresupuesto);
    }

    public List<PresupuestoFinancieroDTO> gastosPresupuesto(String codigo) {

        List<RepPresupuestoBase> presupuestos =
                repPresupuestoBaseService.buscarPorCodigoProyecto(codigo);

        return presupuestos.stream().map(p -> {

            List<GastoPresupuestoDTO> gastos = repo
                    .findByIdPresupuesto(p.getIdPresupuesto())
                    .stream()
                    .map(g -> new GastoPresupuestoDTO(g.getIdGasto(),
                            g.getIdPresupuesto(),
                            g.getMontoGasto(),
                            g.getFechaGasto(),
                            g.getDescripcionGasto()
                    ))
                    .toList();

            return new PresupuestoFinancieroDTO( p.getIdPresupuesto(),
                    p.getCodigoProyecto(),
                    p.getDescripcionPresupuesto(),
                    p.getCategoriaPresupuesto(),
                    p.getFechaAsignacion(),
                    p.getTipoPresupuesto(),
                    p.getFuenteFinanciamiento(),
                    p.getMontoAsignado(),
                    gastos
            );

        }).toList();
    }
}
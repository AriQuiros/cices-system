package org.example.backend_cices_system.report.serviceVw;

import org.example.backend_cices_system.report.dao.RepPresupuestoGastosRepository;
import org.example.backend_cices_system.report.dto.GastoPresupuestoDTO;
import org.example.backend_cices_system.report.dto.PresupuestoFinancieroDTO;
import org.example.backend_cices_system.report.view.RepPresupuestoBase;
import org.example.backend_cices_system.report.view.RepPresupuestoGastos;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RepPresupuestoGastosService {

    private final RepPresupuestoGastosRepository repo;
    private final RepPresupuestoBaseService repPresupuestoBaseService;

    public RepPresupuestoGastosService(
            RepPresupuestoGastosRepository repo,
            RepPresupuestoBaseService repPresupuestoBaseService
    ) {
        this.repo = repo;
        this.repPresupuestoBaseService = repPresupuestoBaseService;
    }

    public List<RepPresupuestoGastos> obtenerTodos() {
        return repo.findAll();
    }

    public RepPresupuestoGastos buscarPorId(Integer idGasto) {
        return repo.findById(idGasto).orElse(null);
    }

    public List<RepPresupuestoGastos> buscarPorIdPresupuesto(Integer idPresupuesto) {
        return repo.findByIdPresupuesto(idPresupuesto);
    }

    public List<RepPresupuestoGastos> buscarPorCodigoProyecto(String codigoProyecto) {
        return repo.findByCodigoProyecto(codigoProyecto);
    }

    public List<PresupuestoFinancieroDTO> gastosPresupuesto(String codigoProyecto) {

        List<RepPresupuestoBase> presupuestos =
                repPresupuestoBaseService.buscarFinancieroPorCodigoProyecto(codigoProyecto);

        return presupuestos.stream().map(p -> {

            List<GastoPresupuestoDTO> gastos = repo
                    .findByIdPresupuesto(p.getIdPresupuesto())
                    .stream()
                    .map(g -> new GastoPresupuestoDTO(
                            g.getMontoGasto(),
                            g.getFechaGasto(),
                            g.getDescripcionGasto()
                    ))
                    .toList();

            return new PresupuestoFinancieroDTO(
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
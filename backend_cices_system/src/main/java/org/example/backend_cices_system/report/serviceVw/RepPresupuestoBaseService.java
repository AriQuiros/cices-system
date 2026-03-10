package org.example.backend_cices_system.report.serviceVw;

import org.example.backend_cices_system.report.dao.RepPresupuestoBaseRepository;
import org.example.backend_cices_system.report.view.RepPresupuestoBase;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RepPresupuestoBaseService {

    private final RepPresupuestoBaseRepository repo;

    public RepPresupuestoBaseService(RepPresupuestoBaseRepository repo) {
        this.repo = repo;
    }

    public List<RepPresupuestoBase> obtenerTodos() {
        return repo.findAll();
    }

    public RepPresupuestoBase buscarPorId(Integer idPresupuesto) {
        return repo.findById(idPresupuesto).orElse(null);
    }

    public List<RepPresupuestoBase> buscarPorCodigoProyecto(String codigoProyecto) {
        return repo.findByCodigoProyecto(codigoProyecto);
    }

    public List<RepPresupuestoBase> buscarPorIdPresupuesto(Integer idPresupuesto) {
        return repo.findByIdPresupuesto(idPresupuesto);
    }

    public List<RepPresupuestoBase> buscarHorasPorCodigoProyecto(String codigoProyecto) {
        return repo.findByCodigoProyectoAndTipoPresupuestoContainsIgnoreCase(codigoProyecto, "HORAS");
    }

    public List<RepPresupuestoBase> buscarFinancieroPorCodigoProyecto(String codigoProyecto) {
        return repo.findByCodigoProyectoAndTipoPresupuestoContainsIgnoreCase(codigoProyecto, "FINANCIERO");
    }
}


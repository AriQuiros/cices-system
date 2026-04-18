package org.example.backend_cices_system.report.serviceVw;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.report.dao.RepPresupuestoBaseRepository;
import org.example.backend_cices_system.report.view.RepPresupuestoBase;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RepPresupuestoBaseService {

    private final RepPresupuestoBaseRepository repo;

    public List<RepPresupuestoBase> obtenerTodos() {
        return repo.findAll();
    }

    public List<RepPresupuestoBase> buscarPorCodigoProyecto(String codigoProyecto) {
        return repo.findByCodigoProyecto(codigoProyecto);
    }

    public List<RepPresupuestoBase> buscarHorasPorCodigoProyecto(String codigoProyecto) {
        return repo.findByCodigoProyectoAndTipoPresupuestoContainsIgnoreCase(codigoProyecto, "HORAS");
    }

    public List<RepPresupuestoBase> buscarFinancieroPorCodigoProyecto(String codigoProyecto) {
        return repo.findByCodigoProyectoAndTipoPresupuestoContainsIgnoreCase(codigoProyecto, "FINANCIERO");
    }
}


package org.example.backend_cices_system.report.serviceVw;

import org.example.backend_cices_system.logic.Proyecto;
import org.example.backend_cices_system.report.audit.PresupuestoBit;
import org.example.backend_cices_system.report.dao.PresupuestoBitRepository;
import org.example.backend_cices_system.report.dao.RepPresupuestoBaseRepository;
import org.example.backend_cices_system.report.dao.RepPresupuestoGastosRepository;
import org.example.backend_cices_system.report.dao.RepPresupuestoHorasRepository;
import org.example.backend_cices_system.report.view.RepPresupuestoBase;
import org.example.backend_cices_system.report.view.RepPresupuestoGastos;
import org.example.backend_cices_system.report.view.RepPresupuestoHoras;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author angie
 */
@Service
public class PresupuestoConsultaService {

    private final RepPresupuestoBaseRepository presupuestoBaseRepo;
    private final PresupuestoBitRepository presupuestoBitRepository;
    private final RepPresupuestoGastosRepository gastosRepo;
    private final RepPresupuestoHorasRepository horasRepo;

    public PresupuestoConsultaService(
            RepPresupuestoBaseRepository presupuestoBaseRepo,
            PresupuestoBitRepository presupuestoBitRepository,
            RepPresupuestoGastosRepository gastosRepo,
            RepPresupuestoHorasRepository horasRepo
    ) {
        this.presupuestoBaseRepo = presupuestoBaseRepo;
        this.presupuestoBitRepository = presupuestoBitRepository;
        this.gastosRepo = gastosRepo;
        this.horasRepo = horasRepo;
    }

    public List<RepPresupuestoBase> obtenerPresupuestosProyecto(String codigoProyecto) {
        return presupuestoBaseRepo.findByCodigoProyecto(codigoProyecto);
    }

    public List<PresupuestoBit> obtenerHistorialPresupuesto(String codigoProyecto) {
        Integer idProyecto = obtenerPresupuestosProyecto(codigoProyecto)
                .stream()
                .findFirst()
                .map(RepPresupuestoBase::getIdPresupuesto)
                .orElse(null);
        return presupuestoBitRepository.findByIdProyecto(idProyecto);
    }

    public List<RepPresupuestoGastos> obtenerGastosProyecto(String codigoProyecto) {
        return gastosRepo.findByCodigoProyecto(codigoProyecto);
    }

    public List<RepPresupuestoHoras> obtenerHorasProyecto(String codigoProyecto) {
        return horasRepo.findByCodigoProyecto(codigoProyecto);
    }
}

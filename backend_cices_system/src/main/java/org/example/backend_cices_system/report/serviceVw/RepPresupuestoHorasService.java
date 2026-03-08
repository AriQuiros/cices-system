package org.example.backend_cices_system.report.serviceVw;

import org.example.backend_cices_system.report.dao.RepPresupuestoHorasRepository;
import org.example.backend_cices_system.report.dto.InvestigadorHorasDTO;
import org.example.backend_cices_system.report.dto.PresupuestoHorasDTO;
import org.example.backend_cices_system.report.view.RepPresupuestoBase;
import org.example.backend_cices_system.report.view.RepPresupuestoHoras;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RepPresupuestoHorasService {

    private final RepPresupuestoHorasRepository repo;
    private final RepPresupuestoBaseService repPresupuestoBaseService;

    public RepPresupuestoHorasService(RepPresupuestoHorasRepository repo, RepPresupuestoBaseService repPresupuestoBaseService) {
        this.repo = repo;
        this.repPresupuestoBaseService = repPresupuestoBaseService;
    }

    public List<RepPresupuestoHoras> obtenerTodos() {
        return repo.findAll();
    }

    public List<RepPresupuestoHoras> buscarPorIdPresupuesto(Integer idPresupuesto) {
        return repo.findByIdPresupuesto(idPresupuesto);
    }

    public List<RepPresupuestoHoras> buscarPorIdProyecto(Integer idProyecto) {
        return repo.findByIdProyecto(idProyecto);
    }

    public List<RepPresupuestoHoras> buscarPorNombreProyecto(String nombreProyecto) {
        return repo.findByNombreProyectoContainingIgnoreCase(nombreProyecto);
    }

    public List<RepPresupuestoHoras> buscarPorIdInvestigador(Integer idInvestigador) {
        return repo.findByIdInvestigador(idInvestigador);
    }

    public List<RepPresupuestoHoras> buscarPorCodigoProyecto(String codigoProyecto) {
        return repo.findByCodigoProyecto(codigoProyecto);
    }

    public List<PresupuestoHorasDTO> horasPresupuesto(String codigoProyecto) {

        List<RepPresupuestoBase> presupuestos = repPresupuestoBaseService.buscarHorasPorCodigoProyecto(codigoProyecto);

        return presupuestos.stream().map(p -> {

            List<InvestigadorHorasDTO> horas = repo
                    .findByIdPresupuesto(p.getIdPresupuesto())
                    .stream()
                    .map(h -> new InvestigadorHorasDTO(
                            h.getNombreInvestigador(),
                            h.getHorasMes(),
                            h.getCantidadMeses(),
                            h.getModalidad()
                    ))
                    .toList();

            return new PresupuestoHorasDTO(
                    p.getDescripcionPresupuesto(),
                    p.getCategoriaPresupuesto(),
                    p.getFechaAsignacion(),
                    p.getTipoPresupuesto(),
                    p.getCantidadHoras(),
                    p.getCantidadMeses(),
                    horas
            );

        }).toList();
    }

}

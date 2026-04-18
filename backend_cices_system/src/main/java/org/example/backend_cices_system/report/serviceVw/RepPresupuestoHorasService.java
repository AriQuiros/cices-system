package org.example.backend_cices_system.report.serviceVw;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.dto.HorasAsignadasDTO;
import org.example.backend_cices_system.dto.InvestigadorProyectoDTO;
import org.example.backend_cices_system.report.dao.RepPresupuestoHorasRepository;
import org.example.backend_cices_system.report.dto.PresupuestoHorasDTO;
import org.example.backend_cices_system.report.view.RepPresupuestoBase;
import org.example.backend_cices_system.report.view.RepPresupuestoHoras;
import org.example.backend_cices_system.service.CatalogoService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RepPresupuestoHorasService {

    private final RepPresupuestoHorasRepository repo;
    private final RepPresupuestoBaseService repPresupuestoBaseService;
    private final CatalogoService catalogoService;

    public List<RepPresupuestoHoras> obtenerTodos() {
        return repo.findAll();
    }

    public List<RepPresupuestoHoras> buscarPorIdPresupuesto(Integer idPresupuesto) {
        return repo.findByIdPresupuesto(idPresupuesto);
    }

    public List<PresupuestoHorasDTO> horasPresupuesto(String codigoProyecto) {

        List<RepPresupuestoBase> presupuestos = repPresupuestoBaseService.buscarHorasPorCodigoProyecto(codigoProyecto);

        return presupuestos.stream().map(p -> {

            List<HorasAsignadasDTO> horas = repo
                    .findByIdPresupuesto(p.getIdPresupuesto())
                    .stream()
                    .map(h -> new HorasAsignadasDTO(h.getIdHorasAsignadas(),
                            new InvestigadorProyectoDTO(h.getIdInvestigadorProyecto(),
                                    null,
                                    h.getNombreCompleto(),null,null,null,null,
                                    h.getFechaInicioInvestigador(),h.getFechaFinInvestigador()),
                            h.getIdPresupuesto(),
                            catalogoService.codigoXNombreValor(h.getModalidad()),
                            null,
                            h.getCantidadHorasMes(),
                            h.getCantidadMeses()
                    ))
                    .toList();

            return new PresupuestoHorasDTO(p.getIdPresupuesto(),
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

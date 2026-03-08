package org.example.backend_cices_system.service;

import org.example.backend_cices_system.data.InvestigadorProyectoRepository;
import org.example.backend_cices_system.data.RolProyectoRepository;
import org.example.backend_cices_system.dto.InvestigadorProyectoDTO;
import org.example.backend_cices_system.logic.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InvestigadorProyectoService {
    private final InvestigadorProyectoRepository investigadorProyectoRepository;
    private final RolProyectoRepository rolProyectoRepository;
    private final HorasAsignadasService horasService;

    public InvestigadorProyectoService(InvestigadorProyectoRepository investigadorProyectoRepository,
                                       RolProyectoRepository rolProyectoRepository, HorasAsignadasService horasService) {
        this.investigadorProyectoRepository = investigadorProyectoRepository;
        this.rolProyectoRepository = rolProyectoRepository;
        this.horasService = horasService;
    }

    public InvestigadorProyecto guardarInvestigadorProyecto(InvestigadorProyectoDTO investigadorProyectoDTO,
                                            Investigador investigador, Proyecto proyecto) {

        var investigadorProyecto = new InvestigadorProyecto();
        investigadorProyecto.setIdInvestigador(investigador);
        investigadorProyecto.setIdProyecto(proyecto);
        investigadorProyecto.setIdRolProyecto(codigoRolProyecto(investigadorProyectoDTO.rolProyecto()));

        investigadorProyecto.setFechaInicioInvestigador(investigadorProyectoDTO.fechaInicio());
        investigadorProyecto.setFechaFinInvestigador(investigadorProyectoDTO.fechaFin());
        investigadorProyecto.setActividadProyecto(investigadorProyectoDTO.actividadProyecto());

        investigadorProyectoRepository.save(investigadorProyecto);

        if (investigadorProyectoDTO.horasAsignadas() != null && !investigadorProyectoDTO.horasAsignadas().isEmpty()) {
            guardarHorasAsignadas(investigadorProyecto, investigadorProyectoDTO);
        }

        return investigadorProyecto;
    }

    private void guardarHorasAsignadas(InvestigadorProyecto investigadorProyecto, InvestigadorProyectoDTO investigadorDTO) {
        for (var horasDTO : investigadorDTO.horasAsignadas()) {
            horasService.guardarHorasAsignadas(horasDTO, investigadorProyecto);
        }
    }

    RolProyecto codigoRolProyecto(String rolInvestigador) {
        return rolProyectoRepository.findByNombreIgnoreCaseRolProyecto(rolInvestigador)
                .orElseThrow(() -> new RuntimeException("Rol de proyecto no encontrado"));
    }

    public InvestigadorProyecto obtenerInvestigadorProyecto(Investigador investigador, Proyecto proyecto) {
        return investigadorProyectoRepository.findByIdProyectoAndIdInvestigador(proyecto, investigador)
                .orElseThrow(() -> new RuntimeException("InvestigadorProyecto no encontrado para el investigador y proyecto dados"));
    }

}

package org.example.backend_cices_system.service;

import org.example.backend_cices_system.data.InvestigadorProyectoRepository;
import org.example.backend_cices_system.dto.InvestigadorProyectoDTO;
import org.example.backend_cices_system.dto.RolProyectoDTO;
import org.example.backend_cices_system.logic.*;
import org.springframework.stereotype.Service;


@Service
public class InvestigadorProyectoService {
    private final InvestigadorProyectoRepository investigadorProyectoRepository;
    private final RolProyectoService rolProyectoService;

    public InvestigadorProyectoService(InvestigadorProyectoRepository investigadorProyectoRepository,
                                       RolProyectoService rolProyectoService) {
        this.investigadorProyectoRepository = investigadorProyectoRepository;
        this.rolProyectoService = rolProyectoService;
    }

    public InvestigadorProyectoDTO guardarInvestigadorProyecto(InvestigadorProyectoDTO investigadorProyectoDTO,
                                            Investigador investigador, Proyecto proyecto) {

        var investigadorProyecto = new InvestigadorProyecto();
        investigadorProyecto.setIdInvestigador(investigador);
        investigadorProyecto.setIdProyecto(proyecto);
        investigadorProyecto.setIdRolProyecto(rolProyectoService.obtenerRolProyecto(investigadorProyectoDTO.rolProyecto().id()));

        investigadorProyecto.setFechaInicioInvestigador(investigadorProyectoDTO.fechaInicio());
        investigadorProyecto.setFechaFinInvestigador(investigadorProyectoDTO.fechaFin());
        investigadorProyecto.setActividadProyecto(investigadorProyectoDTO.actividadProyecto());

        investigadorProyectoRepository.save(investigadorProyecto);

       /* if (investigadorProyectoDTO.horasAsignadas() != null && !investigadorProyectoDTO.horasAsignadas().isEmpty()) {
            guardarHorasAsignadas(investigadorProyecto, investigadorProyectoDTO);
        }*/

        return investigadorProyectoDTO;
    }

    /*private void guardarHorasAsignadas(InvestigadorProyecto investigadorProyecto, InvestigadorProyectoDTO investigadorDTO) {
        for (var horasDTO : investigadorDTO.horasAsignadas()) {
            horasService.guardarHorasAsignadas(horasDTO, investigadorProyecto);
        }
    }*/

    public InvestigadorProyectoDTO actualizarInvestigadorProyecto(InvestigadorProyectoDTO investigadorDTO){
        InvestigadorProyecto investigadorProyecto = obtenerInvestigadorProyecto(investigadorDTO.id());

        investigadorProyecto.setActividadProyecto(investigadorDTO.actividadProyecto());
        RolProyecto rolProyecto = rolProyectoService.obtenerRolProyecto(investigadorDTO.rolProyecto().id());
        investigadorProyecto.setIdRolProyecto(rolProyecto);
        investigadorProyecto.setFechaInicioInvestigador(investigadorDTO.fechaInicio());
        investigadorProyecto.setFechaFinInvestigador(investigadorDTO.fechaFin());

        investigadorProyectoRepository.save(investigadorProyecto);
        return investigadorDTO;
    }

    public InvestigadorProyectoDTO eliminarInvestigadorProyecto(Integer id){
        var inv = obtenerDTO(obtenerInvestigadorProyecto(id));
        investigadorProyectoRepository.deleteById(id);
        return  inv;
    }

    public InvestigadorProyectoDTO obtenerDTO(InvestigadorProyecto inv){
        return new InvestigadorProyectoDTO(inv.getId(), inv.getIdInvestigador().getIdEmpleado().getIdentificacion(),
                inv.getIdInvestigador().getIdEmpleado().getNombreCompleto(),inv.getIdProyecto().getCodigoProyecto(),
                obtenerRolProyectoDTO(inv.getIdRolProyecto()),inv.getActividadProyecto(),inv.getFechaInicioInvestigador(),
                inv.getFechaFinInvestigador());
    }

    private RolProyectoDTO obtenerRolProyectoDTO(RolProyecto rolProyecto){
        return new RolProyectoDTO(rolProyecto.getId(), rolProyecto.getNombreRolProyecto());
    }

    public InvestigadorProyecto obtenerInvestigadorProyecto(Investigador investigador, Proyecto proyecto) {
        return investigadorProyectoRepository.findByIdProyectoAndIdInvestigador(proyecto, investigador)
                .orElseThrow(() -> new RuntimeException("InvestigadorProyecto no encontrado para el investigador y proyecto dados"));
    }
    public InvestigadorProyecto obtenerInvestigadorProyecto(Integer id) {
        return investigadorProyectoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("InvestigadorProyecto no encontrado para el investigador y proyecto dados"));
    }

}

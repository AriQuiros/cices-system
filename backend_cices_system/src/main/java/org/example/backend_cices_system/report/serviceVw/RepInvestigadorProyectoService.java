package org.example.backend_cices_system.report.serviceVw;

import org.example.backend_cices_system.dto.InvestigadorProyectoDTO;
import org.example.backend_cices_system.dto.RolProyectoDTO;
import org.example.backend_cices_system.report.dao.RepInvestigadorProyectoRepository;
import org.example.backend_cices_system.report.view.RepInvestigadorProyecto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RepInvestigadorProyectoService {

    private final RepInvestigadorProyectoRepository repo;

    public RepInvestigadorProyectoService(RepInvestigadorProyectoRepository repo) {
        this.repo = repo;
    }

    public List<RepInvestigadorProyecto> obtenerTodos() {
        return repo.findAll();
    }

    public RepInvestigadorProyecto buscarPorId(Integer idInvestigadorProyecto) {
        return repo.findById(idInvestigadorProyecto).orElse(null);
    }

    public List<RepInvestigadorProyecto> buscarPorIdentificacionInvestigador(String idInvestigador) {
        return repo.findByIdentificacion(idInvestigador);
    }

    private InvestigadorProyectoDTO toInvestigadorProyectoDTO(RepInvestigadorProyecto r) {
        return new InvestigadorProyectoDTO( r.getIdInvestigadorProyecto(),
                r.getIdentificacion(),
                r.getNombreInvestigador(),
                r.getCodigoProyecto(),
                new RolProyectoDTO(r.getIdRolProyecto(),r.getRolProyecto()),
                r.getActividadProyecto(),
                r.getFechaInicioInvestigador(),
                r.getFechaFinInvestigador()
        );
    }

    public List<InvestigadorProyectoDTO> buscarPorIdProyecto(Integer idProyecto) {
        return repo.findByIdProyecto(idProyecto)
                .stream()
                .map(this::toInvestigadorProyectoDTO)
                .toList();
    }

    public List<InvestigadorProyectoDTO> buscarPorCodigoProyecto(String codigoProyecto) {
        return repo.findByCodigoProyecto(codigoProyecto)
                .stream()
                .map(this::toInvestigadorProyectoDTO)
                .toList();
    }

    public List<RepInvestigadorProyecto> buscarPorNombreInvestigador(String nombre) {
        return repo.findByNombreInvestigadorContainingIgnoreCase(nombre);
    }
}

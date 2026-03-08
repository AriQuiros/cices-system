package org.example.backend_cices_system.report.serviceVw;

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

    public List<RepInvestigadorProyecto> buscarPorCodigoProyecto(String codigoProyecto) {
        return repo.findByCodigoProyecto(codigoProyecto);
    }

    public List<RepInvestigadorProyecto> buscarPorNombreInvestigador(String nombre) {
        return repo.findByNombreInvestigadorContainingIgnoreCase(nombre);
    }
}

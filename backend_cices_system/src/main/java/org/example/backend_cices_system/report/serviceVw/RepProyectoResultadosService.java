package org.example.backend_cices_system.report.serviceVw;

import org.example.backend_cices_system.report.dao.RepProyectoResultadosRepository;
import org.example.backend_cices_system.report.view.RepProyectoResultados;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RepProyectoResultadosService {

    private final RepProyectoResultadosRepository repo;

    public RepProyectoResultadosService(RepProyectoResultadosRepository repo) {
        this.repo = repo;
    }

    public List<RepProyectoResultados> obtenerTodos() {
        return repo.findAll();
    }

    public RepProyectoResultados buscarPorIdProyecto(Integer idProyecto) {
        return repo.findById(idProyecto).orElse(null);
    }

    public List<RepProyectoResultados> buscarPorCodigoProyecto(String codigoProyecto) {
        return repo.findByCodigoProyecto(codigoProyecto);
    }

    public List<RepProyectoResultados> buscarPorNombreProyecto(String nombreProyecto) {
        return repo.findByNombreProyectoContainingIgnoreCase(nombreProyecto);
    }
}

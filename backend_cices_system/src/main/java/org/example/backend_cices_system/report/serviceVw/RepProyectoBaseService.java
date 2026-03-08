package org.example.backend_cices_system.report.serviceVw;

import org.example.backend_cices_system.report.dao.RepProyectoBaseRepository;
import org.example.backend_cices_system.report.view.RepProyectoBase;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RepProyectoBaseService {

    private final RepProyectoBaseRepository repo;

    public RepProyectoBaseService(RepProyectoBaseRepository repo) {
        this.repo = repo;
    }

    public List<RepProyectoBase> obtenerTodos() {
        return repo.findAll();
    }

    public RepProyectoBase buscarPorId(Integer idProyecto) {
        return repo.findById(idProyecto).orElse(null);
    }

    public RepProyectoBase buscarPorCodigoProyecto(String codigoProyecto) {
        return repo.findByCodigoProyecto(codigoProyecto);
    }

    public List<RepProyectoBase> buscarPorNombreProyecto(String nombreProyecto) {
        return repo.findByNombreProyectoContainingIgnoreCase(nombreProyecto);
    }
}


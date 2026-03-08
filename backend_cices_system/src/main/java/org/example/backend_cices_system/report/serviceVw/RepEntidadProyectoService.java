package org.example.backend_cices_system.report.serviceVw;

import org.example.backend_cices_system.report.dao.RepEntidadProyectoRepository;
import org.example.backend_cices_system.report.view.RepEntidadProyecto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RepEntidadProyectoService {

    private final RepEntidadProyectoRepository repo;

    public RepEntidadProyectoService(RepEntidadProyectoRepository repo) {
        this.repo = repo;
    }

    public List<RepEntidadProyecto> obtenerTodos() {
        return repo.findAll();
    }

    public RepEntidadProyecto buscarPorId(Integer idEntidadProyecto) {
        return repo.findById(idEntidadProyecto).orElse(null);
    }

    public List<RepEntidadProyecto> buscarPorNombreEntidad(String nombreEntidad) {
        return repo.findByNombreEntidadContainingIgnoreCase(nombreEntidad);
    }

    public List<RepEntidadProyecto> buscarPorCodigoProyecto(String codigoProyecto) {
        return repo.findByCodigoProyecto(codigoProyecto);
    }
}

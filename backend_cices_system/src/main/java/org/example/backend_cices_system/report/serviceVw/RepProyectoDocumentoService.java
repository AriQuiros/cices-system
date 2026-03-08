package org.example.backend_cices_system.report.serviceVw;

import org.example.backend_cices_system.report.dao.RepProyectoDocumentoRepository;
import org.example.backend_cices_system.report.view.RepProyectoDocumento;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RepProyectoDocumentoService {

    private final RepProyectoDocumentoRepository repo;

    public RepProyectoDocumentoService(RepProyectoDocumentoRepository repo) {
        this.repo = repo;
    }

    public List<RepProyectoDocumento> obtenerTodos() {
        return repo.findAll();
    }

    public RepProyectoDocumento buscarPorId(Integer idDocumento) {
        return repo.findById(idDocumento).orElse(null);
    }

    public List<RepProyectoDocumento> buscarPorIdProyecto(Integer idProyecto) {
        return repo.findByIdProyecto(idProyecto);
    }

    public List<RepProyectoDocumento> buscarPorCodigoProyecto(String codigoProyecto) {
        return repo.findByCodigoProyecto(codigoProyecto);
    }

    public List<RepProyectoDocumento> buscarPorNombreProyecto(String nombreProyecto) {
        return repo.findByNombreProyectoContainingIgnoreCase(nombreProyecto);
    }
}

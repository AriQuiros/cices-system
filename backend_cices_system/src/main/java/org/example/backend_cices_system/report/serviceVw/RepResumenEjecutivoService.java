package org.example.backend_cices_system.report.serviceVw;

import org.example.backend_cices_system.report.dao.RepResumenEjecutivoRepository;
import org.example.backend_cices_system.report.view.RepResumenEjecutivo;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RepResumenEjecutivoService {

    private final RepResumenEjecutivoRepository repo;

    public RepResumenEjecutivoService(RepResumenEjecutivoRepository repo) {
        this.repo = repo;
    }

    public List<RepResumenEjecutivo> obtenerTodos() {
        return repo.findAll();
    }

}

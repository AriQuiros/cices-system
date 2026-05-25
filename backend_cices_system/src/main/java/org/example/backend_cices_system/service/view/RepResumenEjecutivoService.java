package org.example.backend_cices_system.service.view;

import org.example.backend_cices_system.model.view.RepResumenEjecutivo;
import org.example.backend_cices_system.repository.view.RepResumenEjecutivoRepository;
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

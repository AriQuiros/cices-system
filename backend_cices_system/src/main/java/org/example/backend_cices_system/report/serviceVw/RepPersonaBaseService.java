package org.example.backend_cices_system.report.serviceVw;

import org.example.backend_cices_system.report.dao.RepPersonaBaseRepository;
import org.example.backend_cices_system.report.view.RepPersonaBase;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RepPersonaBaseService {

    private final RepPersonaBaseRepository repo;

    public RepPersonaBaseService(RepPersonaBaseRepository repo) {
        this.repo = repo;
    }

    public List<RepPersonaBase> obtenerTodos() {
        return repo.findAll();
    }

    public RepPersonaBase buscarPorId(Integer idEmpleado) {
        return repo.findById(idEmpleado).orElse(null);
    }

    public RepPersonaBase buscarPorIdentificacion(String identificacion) {
        return repo.findByIdentificacion(identificacion);
    }

    public List<RepPersonaBase> buscarPorNombre(String nombreCompleto) {
        return repo.findByNombreCompletoContainingIgnoreCase(nombreCompleto);
    }
}

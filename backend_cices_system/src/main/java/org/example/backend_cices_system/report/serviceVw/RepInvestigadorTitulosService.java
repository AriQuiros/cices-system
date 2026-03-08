package org.example.backend_cices_system.report.serviceVw;

import org.example.backend_cices_system.report.dao.RepInvestigadorTitulosRepository;
import org.example.backend_cices_system.report.view.RepInvestigadorTitulos;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RepInvestigadorTitulosService {

    private final RepInvestigadorTitulosRepository repo;

    public RepInvestigadorTitulosService(RepInvestigadorTitulosRepository repo) {
        this.repo = repo;
    }

    public List<RepInvestigadorTitulos> obtenerTodos() {
        return repo.findAll();
    }

    public RepInvestigadorTitulos buscarPorId(Integer idTitulo) {
        return repo.findById(idTitulo).orElse(null);
    }

    public List<RepInvestigadorTitulos> buscarPorIdentificacion(String identificacion) {
        return repo.findByIdentificacion(identificacion);
    }

    public List<RepInvestigadorTitulos> buscarPorNombre(String nombre) {
        return repo.findByNombreInvestigadorContainingIgnoreCase(nombre);
    }
}


package org.example.backend_cices_system.report.serviceVw;

import org.example.backend_cices_system.report.dao.RepInvestigadorCertificacionesRepository;
import org.example.backend_cices_system.report.view.RepInvestigadorCertificaciones;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RepInvestigadorCertificacionesService {

    private final RepInvestigadorCertificacionesRepository repo;

    public RepInvestigadorCertificacionesService(RepInvestigadorCertificacionesRepository repo) {
        this.repo = repo;
    }

    public List<RepInvestigadorCertificaciones> obtenerTodos() {
        return repo.findAll();
    }

    public RepInvestigadorCertificaciones buscarPorId(Integer idCertificacion) {
        return repo.findById(idCertificacion).orElse(null);
    }

    public List<RepInvestigadorCertificaciones> buscarPorIdentificacion(String identificacion) {
        return repo.findByIdentificacion(identificacion);
    }

    public List<RepInvestigadorCertificaciones> buscarPorNombre(String nombre) {
        return repo.findByNombreInvestigadorContainingIgnoreCase(nombre);
    }
}

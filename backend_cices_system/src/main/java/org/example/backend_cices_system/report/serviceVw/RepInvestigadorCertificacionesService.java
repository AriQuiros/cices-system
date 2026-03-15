package org.example.backend_cices_system.report.serviceVw;

import org.example.backend_cices_system.report.dao.RepInvestigadorCertificacionesRepository;
import org.example.backend_cices_system.report.dto.FormacionDTO;
import org.example.backend_cices_system.report.view.RepInvestigadorCertificaciones;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

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

    public List<FormacionDTO> obtenerTodasCertificaciones() {
        List<RepInvestigadorCertificaciones> certificados = repo.findAll();

        return certificados.stream()
                .map(c -> new FormacionDTO(
                        c.getIdentificacion(),
                        c.getNombreInvestigador(),
                        c.getNombreCertificacion(),
                        c.getInstitucion(),
                        c.getTipoCertificacion(),
                        c.getEstadoCertificacion(),
                        c.getFechaExpiracion()
                ))
                .collect(Collectors.toList());
    }
}

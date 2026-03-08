package org.example.backend_cices_system.report.dao;

import org.example.backend_cices_system.report.view.RepInvestigadorCertificaciones;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RepInvestigadorCertificacionesRepository extends JpaRepository<RepInvestigadorCertificaciones, Integer> {

    List<RepInvestigadorCertificaciones> findAll();

    List<RepInvestigadorCertificaciones> findByIdInvestigador(Integer idInvestigador);

    List<RepInvestigadorCertificaciones> findByIdentificacion(String identificacion);

    List<RepInvestigadorCertificaciones> findByNombreInvestigadorContainingIgnoreCase(String nombreInvestigador);

    List<RepInvestigadorCertificaciones> findByNombreCertificacionContainingIgnoreCase(String nombreCertificacion);

}

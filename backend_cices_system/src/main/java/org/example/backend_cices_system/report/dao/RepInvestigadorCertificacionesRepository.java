package org.example.backend_cices_system.report.dao;

import org.example.backend_cices_system.report.view.RepInvestigadorCertificaciones;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RepInvestigadorCertificacionesRepository
        extends JpaRepository<RepInvestigadorCertificaciones, Integer>,
        JpaSpecificationExecutor<RepInvestigadorCertificaciones> {

    List<RepInvestigadorCertificaciones> findByIdInvestigador(Integer idInvestigador);
    List<RepInvestigadorCertificaciones> findByIdentificacion(String identificacion);
}

package org.example.backend_cices_system.repository.view;

import org.example.backend_cices_system.model.view.RepInvestigadorCertificaciones;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RepInvestigadorCertificacionesRepository
        extends JpaRepository<RepInvestigadorCertificaciones, Integer>,
        JpaSpecificationExecutor<RepInvestigadorCertificaciones> {

    List<RepInvestigadorCertificaciones> findByIdentificacion(String identificacion);
    List<RepInvestigadorCertificaciones> findByIdInvestigador(Integer idInvestigador);
}

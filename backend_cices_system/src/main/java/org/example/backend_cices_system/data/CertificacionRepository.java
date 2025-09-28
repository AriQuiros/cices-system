package org.example.backend_cices_system.data;

import jakarta.validation.constraints.NotNull;
import org.example.backend_cices_system.logic.Certificacion;
import org.example.backend_cices_system.logic.Investigador;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;

public interface CertificacionRepository extends JpaRepository<Certificacion, Short> {
    int countByFechaExpiracionBetween(LocalDate desde, LocalDate hasta);
    boolean existsByIdInvestigadorAndNombreCertificacionIgnoreCase(Investigador idInvestigador, String nombreCertificacion);

}

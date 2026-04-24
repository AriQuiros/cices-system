package org.example.backend_cices_system.modules.investigador.repository;

import org.example.backend_cices_system.modules.investigador.model.Certificacion;
import org.example.backend_cices_system.modules.investigador.model.Investigador;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface CertificacionRepository extends JpaRepository<Certificacion, Integer> {
    List<Certificacion> findCertificacionByIdInvestigador(Investigador idInvestigador);

    List<Certificacion> findByFechaExpiracionBetween(LocalDate inicio, LocalDate fin);

    List<Certificacion> findByFechaExpiracionBefore(LocalDate hoy);
}

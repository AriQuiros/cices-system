package org.example.backend_cices_system.report.dao;

import org.example.backend_cices_system.report.view.RepResumenEjecutivo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RepResumenEjecutivoRepository extends JpaRepository<RepResumenEjecutivo, Long> {
}

package org.example.backend_cices_system.repository.view;

import org.example.backend_cices_system.model.view.RepResumenEjecutivo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RepResumenEjecutivoRepository extends JpaRepository<RepResumenEjecutivo, Long> {
}

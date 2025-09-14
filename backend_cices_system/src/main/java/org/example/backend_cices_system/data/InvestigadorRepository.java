package org.example.backend_cices_system.data;

import org.example.backend_cices_system.logic.Investigador;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InvestigadorRepository extends JpaRepository<Investigador,Short> {
}

package org.example.backend_cices_system.report.dao;

import org.example.backend_cices_system.report.view.RepPersonaUsuaria;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RepPersonaUsuariaRepository extends JpaRepository<RepPersonaUsuaria, Integer> {
    List<RepPersonaUsuaria> findByIdentificacion(String identificacion);
}

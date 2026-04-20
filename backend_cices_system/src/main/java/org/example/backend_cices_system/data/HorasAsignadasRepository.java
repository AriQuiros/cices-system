package org.example.backend_cices_system.data;

import org.example.backend_cices_system.logic.HorasAsignada;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HorasAsignadasRepository extends JpaRepository<HorasAsignada, Integer> {
    boolean existsByIdInvestigadorProyecto_Id(Integer idInvestigadorProyectoId);

}

package org.example.backend_cices_system.repository.entity;

import org.example.backend_cices_system.model.entity.HorasAsignada;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HorasAsignadasRepository extends JpaRepository<HorasAsignada, Integer> {
    boolean existsByIdInvestigadorProyecto_Id(Integer idInvestigadorProyectoId);

}

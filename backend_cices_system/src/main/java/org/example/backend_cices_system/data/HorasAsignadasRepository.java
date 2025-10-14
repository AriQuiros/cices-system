package org.example.backend_cices_system.data;

import org.example.backend_cices_system.logic.HorasAsignada;
import org.example.backend_cices_system.logic.InvestigadorProyecto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HorasAsignadasRepository extends JpaRepository<HorasAsignada, Short> {
    void deleteByIdInvestigadorProyecto(InvestigadorProyecto ip);
}
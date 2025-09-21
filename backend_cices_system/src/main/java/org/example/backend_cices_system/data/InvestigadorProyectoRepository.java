package org.example.backend_cices_system.data;

import org.example.backend_cices_system.logic.InvestigadorProyecto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface InvestigadorProyectoRepository extends JpaRepository<InvestigadorProyecto, Short> {
    @Query("select count(distinct ip.idInvestigador.id) from InvestigadorProyecto ip")
    long countInvestigadoresAsignados();
}


package org.example.backend_cices_system.data;

import org.example.backend_cices_system.logic.Investigador;
import org.example.backend_cices_system.logic.InvestigadorProyecto;
import org.example.backend_cices_system.logic.Proyecto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface InvestigadorProyectoRepository extends JpaRepository<InvestigadorProyecto, Short> {
    @Query("select count(distinct ip.idInvestigador.id) from InvestigadorProyecto ip")
    long countInvestigadoresAsignados();

    @Query("""
        select distinct p.id
        from InvestigadorProyecto ip
        join ip.idProyecto p
        where ip.idInvestigador = :inv
    """)
    List<Short> findProyectoIdsByInvestigador(@Param("inv") Investigador inv);
}

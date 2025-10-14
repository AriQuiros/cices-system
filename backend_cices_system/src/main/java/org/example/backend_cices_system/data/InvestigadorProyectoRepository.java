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

    @Query("""
    select distinct p.id
    from InvestigadorProyecto ip
    join ip.idProyecto p
    where ip.idInvestigador = :inv
      and (ip.fechaFinInvestigador is null or ip.fechaFinInvestigador >= CURRENT_DATE)
""")
    List<Short> findProyectoIdsVigentesByInvestigador(@Param("inv") Investigador inv);

    @Query("""
    select distinct p.id
    from InvestigadorProyecto ip
    join ip.idProyecto p
    where ip.idInvestigador = :inv
      and ip.fechaFinInvestigador < CURRENT_DATE
""")
    List<Short> findProyectoIdsFinalizadosByInvestigador(@Param("inv") Investigador inv);

    List<InvestigadorProyecto> findInvestigadoresByIdProyecto(Proyecto proyecto);

    List<InvestigadorProyecto> findByIdProyecto_Id(Short proyectoId);

}

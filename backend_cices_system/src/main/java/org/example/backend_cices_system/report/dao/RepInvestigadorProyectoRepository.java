package org.example.backend_cices_system.report.dao;

import org.example.backend_cices_system.report.view.RepInvestigadorProyecto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RepInvestigadorProyectoRepository extends JpaRepository<RepInvestigadorProyecto, Integer> {

    List<RepInvestigadorProyecto> findAll();

    List<RepInvestigadorProyecto> findByIdInvestigador(Integer idInvestigador);

    List<RepInvestigadorProyecto> findByIdentificacion(String identificacion);

    List<RepInvestigadorProyecto> findByNombreInvestigadorContainingIgnoreCase(String nombreInvestigador);

    List<RepInvestigadorProyecto> findByCodigoProyecto(String codigoProyecto);

    List<RepInvestigadorProyecto> findByIdProyecto(Integer idProyecto);

    List<RepInvestigadorProyecto> findByNombreProyectoContainingIgnoreCase(String nombreProyecto);

    List<RepInvestigadorProyecto> findByRolProyecto(String rolEnProyecto);

}

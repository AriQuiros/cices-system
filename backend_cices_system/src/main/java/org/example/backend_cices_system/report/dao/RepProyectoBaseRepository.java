package org.example.backend_cices_system.report.dao;

import org.example.backend_cices_system.report.view.RepProyectoBase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RepProyectoBaseRepository extends JpaRepository<RepProyectoBase, Integer> {

    List<RepProyectoBase> findAll();

    RepProyectoBase findByCodigoProyecto(String codigoProyecto);

    List<RepProyectoBase> findByNombreProyectoContainingIgnoreCase(String nombreProyecto);

    List<RepProyectoBase> findByLineaInvestigacionContainingIgnoreCase(String lineaInvestigacion);

    List<RepProyectoBase> findByEstadoProyecto(String estadoProyecto);

    List<RepProyectoBase> findByTipoProyecto(String tipoProyecto);
}

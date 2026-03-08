package org.example.backend_cices_system.report.dao;

import org.example.backend_cices_system.report.view.RepEntidadProyecto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RepEntidadProyectoRepository extends JpaRepository<RepEntidadProyecto, Integer> {

    List<RepEntidadProyecto> findAll();

    List<RepEntidadProyecto> findByNombreProyectoContainingIgnoreCase(String nombreProyecto);

    List<RepEntidadProyecto> findByCodigoProyecto(String codigoProyecto);

    List<RepEntidadProyecto> findByNombreEntidadContainingIgnoreCase(String nombreEntidad);

    List<RepEntidadProyecto> findByPaisEntidad(String paisEntidad);
}

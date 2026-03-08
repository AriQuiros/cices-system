package org.example.backend_cices_system.report.dao;

import org.example.backend_cices_system.report.view.RepPresupuestoBase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RepPresupuestoBaseRepository extends JpaRepository<RepPresupuestoBase, Integer> {

    List<RepPresupuestoBase> findAll();

    List<RepPresupuestoBase> findByCodigoProyecto(String codigoProyecto);

    List<RepPresupuestoBase> findByCodigoProyectoAndTipoPresupuestoContainsIgnoreCase(String codigoProyecto, String tipoPresupuesto);

    List<RepPresupuestoBase> findByNombreProyectoContainingIgnoreCase(String nombreProyecto);

    List<RepPresupuestoBase> findByTipoPresupuesto(String tipoPresupuesto);

    List<RepPresupuestoBase> findByFuenteFinanciamiento(String fuenteFinanciamiento);

    List<RepPresupuestoBase> findByCategoriaPresupuesto(String categoriaPresupuesto);
}

package org.example.backend_cices_system.report.dao;

import org.example.backend_cices_system.report.view.RepPresupuestoGastos;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RepPresupuestoGastosRepository extends JpaRepository<RepPresupuestoGastos, Integer> {

    List<RepPresupuestoGastos> findAll();

    List<RepPresupuestoGastos> findByIdPresupuesto(Integer idPresupuesto);

    List<RepPresupuestoGastos> findByCodigoProyecto(String codigoProyecto);

    List<RepPresupuestoGastos> findByIdProyecto(Integer idProyecto);

    List<RepPresupuestoGastos> findByNombreProyectoContainingIgnoreCase(String nombreProyecto);

    List<RepPresupuestoGastos> findByDescripcionGastoContainingIgnoreCase(String descripcionGasto);
}

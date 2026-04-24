package org.example.backend_cices_system.consult.presupuesto.repository;

import org.example.backend_cices_system.consult.presupuesto.view.RepPresupuestoGastos;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface RepPresupuestoGastosRepository extends JpaRepository<RepPresupuestoGastos, Integer> {

    List<RepPresupuestoGastos> findByIdPresupuesto(Integer idPresupuesto);

    Page<RepPresupuestoGastos> findByIdPresupuesto(Integer idPresupuesto, Pageable pageable);

    List<RepPresupuestoGastos> findByIdProyectoIn(List<Integer> ids);

    List<RepPresupuestoGastos> findByIdProyecto(Integer idProyecto);

    List<RepPresupuestoGastos> findByIdPresupuestoIn(Collection<Integer> idPresupuestos);

}

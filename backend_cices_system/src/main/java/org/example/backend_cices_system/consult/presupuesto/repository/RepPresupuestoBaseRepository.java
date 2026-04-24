package org.example.backend_cices_system.consult.presupuesto.repository;

import org.example.backend_cices_system.consult.presupuesto.view.RepPresupuestoBase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RepPresupuestoBaseRepository
        extends JpaRepository<RepPresupuestoBase, Integer>,
        JpaSpecificationExecutor<RepPresupuestoBase> {

    List<RepPresupuestoBase> findByIdProyectoIn(List<Integer> ids);

    List<RepPresupuestoBase> findByIdProyecto(Integer idProyecto);
}

package org.example.backend_cices_system.repository.view;

import org.example.backend_cices_system.model.view.RepPresupuestoHoras;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface RepPresupuestoHorasRepository extends JpaRepository<RepPresupuestoHoras, Integer> {
    List<RepPresupuestoHoras> findByIdPresupuesto(Integer idPresupuesto);

    Page<RepPresupuestoHoras> findByIdPresupuesto(Integer idPresupuesto, Pageable pageable);

    List<RepPresupuestoHoras> findByIdPresupuestoIn(Collection<Integer> idPresupuestos);

    List<RepPresupuestoHoras> findByIdProyectoIn(List<Integer> ids);

    List<RepPresupuestoHoras> findByIdProyecto(Integer idProyecto);

}

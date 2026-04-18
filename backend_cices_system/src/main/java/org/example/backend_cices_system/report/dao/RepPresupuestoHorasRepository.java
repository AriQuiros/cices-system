package org.example.backend_cices_system.report.dao;

import org.example.backend_cices_system.report.view.RepPresupuestoHoras;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RepPresupuestoHorasRepository extends JpaRepository<RepPresupuestoHoras, Integer> {

    List<RepPresupuestoHoras> findByIdPresupuesto(Integer idPresupuesto);

}

package org.example.backend_cices_system.report.dao;

import org.example.backend_cices_system.report.view.RepPresupuestoGastos;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RepPresupuestoGastosRepository extends JpaRepository<RepPresupuestoGastos, Integer> {

    List<RepPresupuestoGastos> findByIdPresupuesto(Integer idPresupuesto);

}

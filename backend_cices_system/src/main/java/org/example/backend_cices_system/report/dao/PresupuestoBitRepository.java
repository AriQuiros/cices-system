package org.example.backend_cices_system.report.dao;

import org.example.backend_cices_system.report.audit.PresupuestoBit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PresupuestoBitRepository extends JpaRepository<PresupuestoBit, Long> {
    List<PresupuestoBit> findByIdPresupuesto(Integer idPresupuesto);
    List<PresupuestoBit> findByIdProyecto(Integer idProyecto);
}
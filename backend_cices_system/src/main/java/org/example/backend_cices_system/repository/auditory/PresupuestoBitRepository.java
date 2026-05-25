package org.example.backend_cices_system.repository.auditory;

import org.example.backend_cices_system.model.auditory.PresupuestoBit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PresupuestoBitRepository extends JpaRepository<PresupuestoBit, Long> {
    List<PresupuestoBit> findByIdProyecto(Integer idProyecto);
    List<PresupuestoBit> findByIdPresupuestoAndAccBit(Integer idPresupuesto, Character accBit);

    // Agregar:
    List<PresupuestoBit> findByIdPresupuestoIn(List<Integer> ids);
}
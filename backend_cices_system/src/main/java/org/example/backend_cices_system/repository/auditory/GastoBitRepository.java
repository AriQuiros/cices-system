package org.example.backend_cices_system.repository.auditory;

import org.example.backend_cices_system.model.auditory.GastoBit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GastoBitRepository extends JpaRepository<GastoBit, Long> {
    List<GastoBit> findByIdGastoAndAccBit(Integer idGasto, Character accBit);

    List<GastoBit> findByIdPresupuesto(Integer idPresupuesto);
    List<GastoBit> findByIdPresupuestoIn(List<Integer> ids);
}

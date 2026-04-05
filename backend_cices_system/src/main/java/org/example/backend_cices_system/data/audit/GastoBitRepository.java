package org.example.backend_cices_system.data.audit;

import org.example.backend_cices_system.logic.audit.GastoBit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GastoBitRepository extends JpaRepository<GastoBit, Long> {
    List<GastoBit> findByIdGasto(Integer idGasto);
    List<GastoBit> findByIdGastoAndAccBit(Integer idGasto, Character accBit);
}

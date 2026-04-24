package org.example.backend_cices_system.modules.gasto.repository;

import org.example.backend_cices_system.modules.gasto.model.GastoBit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GastoBitRepository extends JpaRepository<GastoBit, Long> {
    List<GastoBit> findByIdGasto(Integer idGasto);
    List<GastoBit> findByIdGastoAndAccBit(Integer idGasto, Character accBit);
}

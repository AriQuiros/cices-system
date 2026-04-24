package org.example.backend_cices_system.modules.gasto.repository;

import org.example.backend_cices_system.modules.gasto.model.Gasto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GastoRepository extends JpaRepository<Gasto, Integer> {
}

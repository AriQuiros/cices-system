package org.example.backend_cices_system.data;

import org.example.backend_cices_system.logic.Gasto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GastoRepository extends JpaRepository<Gasto, Integer> {
}

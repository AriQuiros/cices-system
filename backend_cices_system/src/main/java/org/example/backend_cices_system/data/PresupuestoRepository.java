package org.example.backend_cices_system.data;


import oracle.jdbc.proxy.annotation.Pre;
import org.example.backend_cices_system.logic.Presupuesto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PresupuestoRepository  extends JpaRepository<Presupuesto, Short>  {
}

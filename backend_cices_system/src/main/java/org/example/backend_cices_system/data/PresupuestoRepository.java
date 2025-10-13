package org.example.backend_cices_system.data;

import org.example.backend_cices_system.logic.Presupuesto;
import org.example.backend_cices_system.logic.Proyecto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PresupuestoRepository  extends JpaRepository<Presupuesto, Short>  {
    List<Presupuesto> findByIdProyecto_IdIn(List<Short> ids);
    List<Presupuesto> findPresupuestoByIdProyecto(Proyecto proyecto);

}

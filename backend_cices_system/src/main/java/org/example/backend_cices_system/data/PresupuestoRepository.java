package org.example.backend_cices_system.data;

import org.example.backend_cices_system.logic.Presupuesto;
import org.example.backend_cices_system.logic.Proyecto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PresupuestoRepository  extends JpaRepository<Presupuesto, Integer> {
    List<Presupuesto> findByIdProyecto_IdIn(List<Short> ids);

    List<Presupuesto> findPresupuestoByIdProyecto(Proyecto proyecto);

    Optional<Presupuesto> findFirstByIdProyectoAndIdCodigoTipoPresupuesto(Proyecto p, Short idCodigoTipoPresupuesto);

    Optional<Presupuesto> findByIdProyecto(Proyecto proyecto);

    Optional<Presupuesto> findByIdProyectoAndIdCodigoTipoPresupuestoAndDescripcion(Proyecto proyecto, Short idCodigoTipoPresupuesto, String descripcion);

    List<Presupuesto> findPresupuestosByIdProyecto_Id(Integer idProyectoId);
}

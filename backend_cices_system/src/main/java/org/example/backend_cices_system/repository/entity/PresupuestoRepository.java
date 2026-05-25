package org.example.backend_cices_system.repository.entity;

import org.example.backend_cices_system.model.entity.Presupuesto;
import org.example.backend_cices_system.model.entity.Proyecto;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PresupuestoRepository  extends JpaRepository<Presupuesto, Integer> {

    List<Presupuesto> findPresupuestoByIdProyecto(Proyecto proyecto);

    @EntityGraph(attributePaths = {"gastos", "horasAsignadas"})
    List<Presupuesto> findByIdProyecto_CodigoProyecto(String codigo);

    Optional<Presupuesto> findByIdProyectoAndIdCodigoTipoPresupuestoAndDescripcion(Proyecto proyecto, Short idCodigoTipoPresupuesto, String descripcion);

}

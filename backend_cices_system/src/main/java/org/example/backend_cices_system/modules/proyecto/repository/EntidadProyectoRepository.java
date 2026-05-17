package org.example.backend_cices_system.modules.proyecto.repository;

import org.example.backend_cices_system.modules.proyecto.model.EntidadProyecto;
import org.example.backend_cices_system.modules.proyecto.model.Proyecto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EntidadProyectoRepository extends JpaRepository<EntidadProyecto, Short> {
    List<EntidadProyecto> findEntidadProyectoByIdProyecto(Proyecto proyecto);
    boolean existsByIdProyecto_IdAndIdEntidad_Id(Integer idProyectoId, Integer idEntidadId);

    @Query("SELECT ep FROM EntidadProyecto ep JOIN FETCH ep.idEntidad WHERE ep.idProyecto.id IN :idsProyectos")
    List<EntidadProyecto> findByIdProyecto_IdIn(@Param("idsProyectos") List<Integer> idsProyectos);
}

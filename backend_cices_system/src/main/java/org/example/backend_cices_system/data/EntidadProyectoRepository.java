package org.example.backend_cices_system.data;

import org.example.backend_cices_system.logic.EntidadProyecto;
import org.example.backend_cices_system.logic.Proyecto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EntidadProyectoRepository extends JpaRepository<EntidadProyecto, Short> {
    List<EntidadProyecto> findEntidadProyectoByIdProyecto(Proyecto proyecto);
}

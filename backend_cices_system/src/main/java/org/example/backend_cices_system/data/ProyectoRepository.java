package org.example.backend_cices_system.data;

import org.example.backend_cices_system.logic.Proyecto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ProyectoRepository extends JpaRepository<Proyecto, Short> {
    Optional<Proyecto> findByCodigoProyecto(String codigoProyecto);

    List<Proyecto> findByIdCodigoTipoEstado(Short idCodigoEstado);

    Proyecto findProyectoById(Short id);

    boolean existsByCodigoProyecto(String codigoProyecto);

    @Query("SELECT DISTINCT p.lineaInvestigacion FROM Proyecto p")
    List<String> findDistinctLineasInvestigacion();
}

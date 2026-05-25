package org.example.backend_cices_system.repository.entity;

import org.example.backend_cices_system.model.entity.Proyecto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ProyectoRepository extends JpaRepository<Proyecto, Integer>, JpaSpecificationExecutor<Proyecto> {
    Optional<Proyecto> findByCodigoProyecto(String codigoProyecto);

    boolean existsByCodigoProyecto(String codigoProyecto);
    List<Proyecto> findByFechaFinalizacionIsNotNull();

    @Query("SELECT DISTINCT p.lineaInvestigacion FROM Proyecto p")
    List<String> findDistinctLineasInvestigacion();

}

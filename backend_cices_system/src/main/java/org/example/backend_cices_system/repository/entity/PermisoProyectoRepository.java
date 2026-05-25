package org.example.backend_cices_system.repository.entity;

import org.example.backend_cices_system.model.entity.PermisoProyecto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PermisoProyectoRepository extends JpaRepository<PermisoProyecto, Integer> {
    List<PermisoProyecto> findByFechaFinPermisoBeforeAndFechaFinPermisoIsNotNull(LocalDate fecha);
    boolean existsByIdInvestigadorProyecto_Id(Integer idInvestigadorProyectoId);
    List<PermisoProyecto> findByIdInvestigadorProyecto_IdProyecto_CodigoProyecto
            (String idInvestigadorProyectoIdProyectoCodigoProyecto);
}
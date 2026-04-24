package org.example.backend_cices_system.modules.investigadorProyecto.repository;

import org.example.backend_cices_system.modules.investigadorProyecto.model.InvestigadorProyecto;
import org.example.backend_cices_system.modules.investigadorProyecto.model.PermisoProyecto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PermisoProyectoRepository extends JpaRepository<PermisoProyecto, Integer> {
    boolean existsByIdInvestigadorProyecto(InvestigadorProyecto idInvestigadorProyecto);
    boolean existsByIdInvestigadorProyecto_Id(Integer idInvestigadorProyectoId);
    List<PermisoProyecto> findByIdInvestigadorProyecto_IdProyecto_CodigoProyecto
            (String idInvestigadorProyectoIdProyectoCodigoProyecto);
}
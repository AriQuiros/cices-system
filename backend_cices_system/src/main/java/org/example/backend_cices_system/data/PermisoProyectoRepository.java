package org.example.backend_cices_system.data;

import org.example.backend_cices_system.logic.InvestigadorProyecto;
import org.example.backend_cices_system.logic.PermisoProyecto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PermisoProyectoRepository extends JpaRepository<PermisoProyecto, Integer> {
    boolean existsByIdInvestigadorProyecto(InvestigadorProyecto idInvestigadorProyecto);
    boolean existsByIdInvestigadorProyecto_Id(Integer idInvestigadorProyectoId);
    List<PermisoProyecto> findByIdInvestigadorProyecto_IdProyecto_CodigoProyecto
            (String idInvestigadorProyectoIdProyectoCodigoProyecto);
}
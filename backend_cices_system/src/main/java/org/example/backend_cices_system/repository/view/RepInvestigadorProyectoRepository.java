package org.example.backend_cices_system.repository.view;

import org.example.backend_cices_system.model.view.RepInvestigadorProyecto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RepInvestigadorProyectoRepository
        extends JpaRepository<RepInvestigadorProyecto, Integer>,
        JpaSpecificationExecutor<RepInvestigadorProyecto> {
    List<RepInvestigadorProyecto> findByIdentificacion(String identificacion);

    List<RepInvestigadorProyecto> findByIdProyecto(Integer idProyecto);

    List<RepInvestigadorProyecto> findByIdProyectoIn(List<Integer> ids);

    List<RepInvestigadorProyecto> findByIdProyectoInOrderByRolProyectoDesc(List<Integer> ids);

    Page<RepInvestigadorProyecto> findByCodigoProyecto(String codigoProyecto, Pageable pageable);


}
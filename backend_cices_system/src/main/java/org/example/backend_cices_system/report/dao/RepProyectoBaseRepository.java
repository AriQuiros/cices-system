package org.example.backend_cices_system.report.dao;

import org.example.backend_cices_system.report.view.RepProyectoBase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RepProyectoBaseRepository extends
        JpaRepository<RepProyectoBase, Integer>,
        JpaSpecificationExecutor<RepProyectoBase> {

    List<RepProyectoBase> findByIdProyectoIn(List<Integer> ids);

    List<RepProyectoBase> findByIdProyecto(Integer idProyecto);

}

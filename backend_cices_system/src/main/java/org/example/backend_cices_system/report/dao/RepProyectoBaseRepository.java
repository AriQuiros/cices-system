package org.example.backend_cices_system.report.dao;

import org.example.backend_cices_system.report.view.RepProyectoBase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RepProyectoBaseRepository extends
        JpaRepository<RepProyectoBase, Integer>,
        JpaSpecificationExecutor<RepProyectoBase> {

    RepProyectoBase findByCodigoProyecto(String codigoProyecto);
    List<RepProyectoBase> findByIdProyectoIn(List<Integer> ids);
}

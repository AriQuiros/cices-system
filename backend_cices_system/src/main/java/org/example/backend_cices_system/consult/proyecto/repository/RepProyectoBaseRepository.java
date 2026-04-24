package org.example.backend_cices_system.consult.proyecto.repository;

import org.example.backend_cices_system.consult.proyecto.view.RepProyectoBase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RepProyectoBaseRepository extends
        JpaRepository<RepProyectoBase, Integer>,
        JpaSpecificationExecutor<RepProyectoBase> {

    List<RepProyectoBase> findByIdProyectoIn(List<Integer> ids);

    List<RepProyectoBase> findByIdProyecto(Integer idProyecto);

}

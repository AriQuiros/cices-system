package org.example.backend_cices_system.report.dao;

import org.example.backend_cices_system.report.view.RepProyectoPresentacionInforme;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RepProyectoPresentacionInformeRepository extends JpaRepository<RepProyectoPresentacionInforme, Integer> {

    List<RepProyectoPresentacionInforme> findByIdProyecto(Integer idProyecto);

    List<RepProyectoPresentacionInforme> findByIdProyectoIn(List<Integer> ids);

}

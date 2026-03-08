package org.example.backend_cices_system.report.dao;

import org.example.backend_cices_system.report.view.RepProyectoPresentacionInforme;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RepProyectoPresentacionInformeRepository extends JpaRepository<RepProyectoPresentacionInforme, Integer> {

    List<RepProyectoPresentacionInforme> findAll();

    List<RepProyectoPresentacionInforme> findByIdProyecto(Integer idProyecto);

    List<RepProyectoPresentacionInforme> findByCodigoProyecto(String codigoProyecto);

    List<RepProyectoPresentacionInforme> findByNombreProyectoContainingIgnoreCase(String nombreProyecto);

    List<RepProyectoPresentacionInforme> findByTipoInforme(String tipoInforme);

    List<RepProyectoPresentacionInforme> findByEstadoInforme(String estadoInforme);
}

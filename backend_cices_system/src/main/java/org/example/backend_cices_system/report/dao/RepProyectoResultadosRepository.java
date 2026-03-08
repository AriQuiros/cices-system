package org.example.backend_cices_system.report.dao;

import org.example.backend_cices_system.report.view.RepProyectoResultados;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RepProyectoResultadosRepository extends JpaRepository<RepProyectoResultados, Integer> {

    List<RepProyectoResultados> findAll();

    List<RepProyectoResultados> findByIdProyecto(Integer idProyecto);

    List<RepProyectoResultados> findByCodigoProyecto(String codigoProyecto);

    List<RepProyectoResultados> findByNombreProyectoContainingIgnoreCase(String nombreProyecto);

    List<RepProyectoResultados> findByTipoMeta(String tipoMeta);

    List<RepProyectoResultados> findByIdObjetivoEspecifico(Integer idObjetivoEspecifico);

    List<RepProyectoResultados> findByIdMeta(Integer idMeta);

    List<RepProyectoResultados> findByIdIndicador(Integer idIndicador);
}

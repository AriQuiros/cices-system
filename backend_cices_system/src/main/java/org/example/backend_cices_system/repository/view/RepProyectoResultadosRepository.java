package org.example.backend_cices_system.repository.view;

import org.example.backend_cices_system.model.view.RepProyectoResultados;
import org.example.backend_cices_system.model.view.RepProyectoResultadosId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RepProyectoResultadosRepository
        extends JpaRepository<RepProyectoResultados, RepProyectoResultadosId> {

    List<RepProyectoResultados> findByIdProyecto(Integer idProyecto);

    List<RepProyectoResultados> findByCodigoProyecto(String codigoProyecto);

    List<RepProyectoResultados> findByIdProyectoIn(List<Integer> ids);
}
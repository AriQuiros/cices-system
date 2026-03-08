package org.example.backend_cices_system.report.dao;

import org.example.backend_cices_system.report.view.RepProyectoDocumento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RepProyectoDocumentoRepository extends JpaRepository<RepProyectoDocumento, Integer> {

    List<RepProyectoDocumento> findAll();

    List<RepProyectoDocumento> findByIdProyecto(Integer idProyecto);

    List<RepProyectoDocumento> findByCodigoProyecto(String codigoProyecto);

    List<RepProyectoDocumento> findByNombreProyectoContainingIgnoreCase(String nombreProyecto);

    List<RepProyectoDocumento> findByNombreDocumentoContainingIgnoreCase(String nombreDocumento);
}

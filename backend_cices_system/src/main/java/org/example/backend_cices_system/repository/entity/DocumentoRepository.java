package org.example.backend_cices_system.repository.entity;

import org.example.backend_cices_system.model.entity.Documento;
import org.example.backend_cices_system.model.entity.Proyecto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface DocumentoRepository extends JpaRepository<Documento, Integer> {
    List<Documento> findDocumentoByIdProyecto(Proyecto proyecto);
    List<Documento> findDocumentoByIdProyecto_Id(Integer idProyectoId);
    List<Documento> findByIdProyecto_IdIn(Collection<Integer> ids);
}

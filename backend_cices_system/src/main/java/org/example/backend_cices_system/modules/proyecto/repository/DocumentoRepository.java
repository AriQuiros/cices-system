package org.example.backend_cices_system.modules.proyecto.repository;

import org.example.backend_cices_system.modules.proyecto.model.Documento;
import org.example.backend_cices_system.modules.proyecto.model.Proyecto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DocumentoRepository extends JpaRepository<Documento, Short> {
    List<Documento> findDocumentoByIdProyecto(Proyecto proyecto);
}

package org.example.backend_cices_system.data;

import org.example.backend_cices_system.logic.Documento;
import org.example.backend_cices_system.logic.Proyecto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DocumentoRepository extends JpaRepository<Documento, Short> {
    List<Documento> findDocumentoByIdProyecto(Proyecto proyecto);
}

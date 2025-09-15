package org.example.backend_cices_system.data;

import org.example.backend_cices_system.logic.Documento;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DocumentoRepository extends JpaRepository<Documento, Short> {
}

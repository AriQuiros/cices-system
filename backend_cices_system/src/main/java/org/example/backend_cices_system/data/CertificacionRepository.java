package org.example.backend_cices_system.data;

import org.example.backend_cices_system.logic.Certificacion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CertificacionRepository extends JpaRepository<Certificacion, Short> {
}

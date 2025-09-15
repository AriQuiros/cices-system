package org.example.backend_cices_system.data;

import org.example.backend_cices_system.logic.Entidad;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EntidadRepository extends JpaRepository<Entidad, Short> {
    Optional<Entidad> findByNombreIgnoreCase(String nombre);
}

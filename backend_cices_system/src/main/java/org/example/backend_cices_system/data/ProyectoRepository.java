package org.example.backend_cices_system.data;

import org.example.backend_cices_system.logic.Proyecto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProyectoRepository extends JpaRepository<Proyecto, Short> {
    Optional<Proyecto> findByCodigoProyecto(String codigoProyecto);
}

package org.example.backend_cices_system.data;

import org.example.backend_cices_system.logic.Empleado;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmpleadoRepository extends JpaRepository<Empleado, Short> {
    Optional<Empleado> findByIdentificacion(String identificacion);
    boolean existsByIdentificacion(String identificacion);
}

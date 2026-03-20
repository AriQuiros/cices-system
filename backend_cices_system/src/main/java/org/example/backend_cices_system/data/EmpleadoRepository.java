package org.example.backend_cices_system.data;

import org.example.backend_cices_system.logic.Empleado;
import org.example.backend_cices_system.logic.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EmpleadoRepository extends JpaRepository<Empleado, Integer> {
    Optional<Empleado> findByIdentificacion(String identificacion);
    boolean existsByIdentificacion(String identificacion);
    Optional<Empleado> findByIdUsuario(Usuario idUsuario);
}
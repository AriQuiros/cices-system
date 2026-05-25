package org.example.backend_cices_system.repository.entity;

import org.example.backend_cices_system.model.entity.Empleado;
import org.example.backend_cices_system.model.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmpleadoRepository extends JpaRepository<Empleado, Integer> {
    boolean existsByIdentificacion(String identificacion);
    Optional<Empleado> findByIdUsuario(Usuario idUsuario);
}
package org.example.backend_cices_system.modules.persona.repository;

import org.example.backend_cices_system.modules.persona.model.Empleado;
import org.example.backend_cices_system.modules.usuario.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmpleadoRepository extends JpaRepository<Empleado, Integer> {
    boolean existsByIdentificacion(String identificacion);
    Optional<Empleado> findByIdUsuario(Usuario idUsuario);
}
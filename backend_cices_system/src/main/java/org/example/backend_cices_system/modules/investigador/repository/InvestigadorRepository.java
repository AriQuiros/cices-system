package org.example.backend_cices_system.modules.investigador.repository;

import org.example.backend_cices_system.modules.investigador.model.Investigador;
import org.example.backend_cices_system.modules.usuario.model.Usuario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface InvestigadorRepository extends JpaRepository<Investigador,Integer> {
    Optional<Investigador> findByIdEmpleadoIdentificacion(String identificacion);
    Optional<Investigador> findByIdEmpleado_IdUsuario(Usuario idEmpleadoIdUsuario);
    Page<Investigador> findByIdEmpleado_IdUsuario_ActivoAndIdEmpleadoNombreCompletoContainsIgnoreCase(
            Boolean activo,
            String nombre,
            Pageable pageable
    );
}

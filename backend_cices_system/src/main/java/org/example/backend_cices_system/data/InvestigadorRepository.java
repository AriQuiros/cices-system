package org.example.backend_cices_system.data;

import org.example.backend_cices_system.logic.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface InvestigadorRepository extends JpaRepository<Investigador,Integer> {
    Optional<Investigador> findByIdEmpleadoIdentificacion(String identificacion);
    Optional<Investigador> findByIdEmpleado_IdUsuario(Usuario idEmpleadoIdUsuario);
    List<Investigador> findByIdEmpleado_IdUsuario_ActivoAndIdEmpleadoNombreCompletoContainsIgnoreCase(Boolean idEmpleadoIdUsuarioActivo, String idEmpleadoNombreCompleto);
}

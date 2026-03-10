package org.example.backend_cices_system.data;

import org.example.backend_cices_system.logic.Empleado;
import org.example.backend_cices_system.logic.Investigador;
import org.example.backend_cices_system.logic.InvestigadorProyecto;
import org.example.backend_cices_system.logic.Proyecto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface InvestigadorRepository extends JpaRepository<Investigador,Integer> {
    Optional<Investigador> findByIdEmpleado(Empleado empleado);
    Optional<Investigador> findByIdEmpleadoIdentificacion(String identificacion);
    List<Investigador> findByIdEmpleado_IdUsuario_ActivoAndIdEmpleadoNombreCompletoContainsIgnoreCase(Boolean idEmpleadoIdUsuarioActivo, String idEmpleadoNombreCompleto);
}

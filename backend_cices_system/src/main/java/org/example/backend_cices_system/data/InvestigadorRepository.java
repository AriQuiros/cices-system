package org.example.backend_cices_system.data;

import org.example.backend_cices_system.logic.Empleado;
import org.example.backend_cices_system.logic.Investigador;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface InvestigadorRepository extends JpaRepository<Investigador,Short> {
    Optional<Investigador> findByIdEmpleado(Empleado empleado);

}

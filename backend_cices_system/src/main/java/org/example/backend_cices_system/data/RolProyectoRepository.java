package org.example.backend_cices_system.data;

import org.example.backend_cices_system.logic.HorasAsignada;
import org.example.backend_cices_system.logic.InvestigadorProyecto;
import org.example.backend_cices_system.logic.RolProyecto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RolProyectoRepository extends JpaRepository<RolProyecto, Short> {

}
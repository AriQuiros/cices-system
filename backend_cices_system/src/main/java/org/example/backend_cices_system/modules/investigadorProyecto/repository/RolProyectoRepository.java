package org.example.backend_cices_system.modules.investigadorProyecto.repository;

import org.example.backend_cices_system.modules.investigadorProyecto.model.RolProyecto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RolProyectoRepository extends JpaRepository<RolProyecto, Short> {

}
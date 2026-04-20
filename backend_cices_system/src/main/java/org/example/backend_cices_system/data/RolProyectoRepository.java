package org.example.backend_cices_system.data;

import org.example.backend_cices_system.logic.RolProyecto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RolProyectoRepository extends JpaRepository<RolProyecto, Short> {

}
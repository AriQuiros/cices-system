package org.example.backend_cices_system.repository.entity;

import org.example.backend_cices_system.model.entity.RolProyecto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RolProyectoRepository extends JpaRepository<RolProyecto, Short> {

}
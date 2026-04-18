package org.example.backend_cices_system.data;

import org.springframework.data.jpa.repository.JpaRepository;
import org.example.backend_cices_system.logic.Rol;

import java.util.Optional;

public interface RolRepository extends JpaRepository<Rol,Short> {
}

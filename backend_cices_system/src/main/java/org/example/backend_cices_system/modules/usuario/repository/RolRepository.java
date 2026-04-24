package org.example.backend_cices_system.modules.usuario.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.example.backend_cices_system.modules.usuario.model.Rol;

public interface RolRepository extends JpaRepository<Rol,Short> {
}

package org.example.backend_cices_system.data;

import org.example.backend_cices_system.logic.NotificacionUsuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificacionUsuarioRepository extends JpaRepository<NotificacionUsuario, Integer> {
}

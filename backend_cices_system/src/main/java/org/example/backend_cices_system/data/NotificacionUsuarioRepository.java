package org.example.backend_cices_system.data;

import org.example.backend_cices_system.logic.NotificacionUsuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface NotificacionUsuarioRepository extends JpaRepository<NotificacionUsuario, Integer> {
    Optional<NotificacionUsuario> findByIdAndIdUsuario_NombreUsuarioIgnoreCase(Integer idNotificacionUsuario, String nombreUsuario);
}

package org.example.backend_cices_system.modules.notificacion.repository;

import org.example.backend_cices_system.modules.notificacion.model.NotificacionUsuario;
import org.example.backend_cices_system.modules.usuario.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface NotificacionUsuarioRepository extends JpaRepository<NotificacionUsuario, Integer> {
    Optional<NotificacionUsuario> findByIdAndIdUsuario(Integer id, Usuario idUsuario);
}

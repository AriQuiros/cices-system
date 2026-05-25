package org.example.backend_cices_system.repository.entity;

import org.example.backend_cices_system.model.entity.NotificacionUsuario;
import org.example.backend_cices_system.model.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface NotificacionUsuarioRepository extends JpaRepository<NotificacionUsuario, Integer> {
    Optional<NotificacionUsuario> findByIdAndIdUsuario(Integer id, Usuario idUsuario);
}

package org.example.backend_cices_system.repository.view;

import org.example.backend_cices_system.model.view.RepNotificacionesUsuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RepNotificacionesUsuarioRepository
        extends JpaRepository<RepNotificacionesUsuario, Integer>,
        JpaSpecificationExecutor<RepNotificacionesUsuario> {

    List<RepNotificacionesUsuario> findByIdUsuario(Integer idUsuario);
    List<RepNotificacionesUsuario> findByNombreUsuarioIgnoreCase(String nombreUsuario);
    List<RepNotificacionesUsuario> findByAsuntoContainingIgnoreCase(String titulo);
}
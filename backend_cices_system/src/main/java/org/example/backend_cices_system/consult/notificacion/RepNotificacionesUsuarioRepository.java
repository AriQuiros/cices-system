package org.example.backend_cices_system.consult.notificacion;

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
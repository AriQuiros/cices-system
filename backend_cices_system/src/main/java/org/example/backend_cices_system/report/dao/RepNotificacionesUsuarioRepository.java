package org.example.backend_cices_system.report.dao;

import org.example.backend_cices_system.report.view.RepNotificacionesUsuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RepNotificacionesUsuarioRepository extends JpaRepository<RepNotificacionesUsuario, Integer> {

    List<RepNotificacionesUsuario> findByIdUsuario(Integer idUsuario);

    List<RepNotificacionesUsuario> findByNombreUsuarioIgnoreCase(String nombreUsuario);

    List<RepNotificacionesUsuario> findByAsuntoContainingIgnoreCase(String titulo);

    List<RepNotificacionesUsuario> findByCategoria(String categoria);

}

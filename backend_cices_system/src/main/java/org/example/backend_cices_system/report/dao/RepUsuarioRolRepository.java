package org.example.backend_cices_system.report.dao;

import org.example.backend_cices_system.report.view.RepUsuarioRol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RepUsuarioRolRepository extends JpaRepository<RepUsuarioRol, Integer> {

    List<RepUsuarioRol> findAll();

    List<RepUsuarioRol> findByIdUsuario(Integer idUsuario);

    List<RepUsuarioRol> findByNombreUsuario(String nombreUsuario);

    List<RepUsuarioRol> findByIdRol(Integer idRol);

    List<RepUsuarioRol> findByNombreRolContainingIgnoreCase(String nombreRol);

    List<RepUsuarioRol> findByActivo(Boolean activo);
}

package org.example.backend_cices_system.modules.usuario.repository;
import org.example.backend_cices_system.modules.usuario.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
    boolean existsByNombreUsuario(String nombreUsuario);
    Optional<Usuario> findByActivoTrueAndNombreUsuario(String nombreUsuario);
    Optional<Usuario> findByNombreUsuario(String nombreUsuario);

}

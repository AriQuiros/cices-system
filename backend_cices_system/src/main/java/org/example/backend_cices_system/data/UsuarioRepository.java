package org.example.backend_cices_system.data;
import org.example.backend_cices_system.logic.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
    boolean existsByNombreUsuario(String nombreUsuario);
    Optional<Usuario> findByActivoTrueAndNombreUsuario(String nombreUsuario);
    Optional<Usuario> findByNombreUsuario(String nombreUsuario);

}

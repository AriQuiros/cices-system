package org.example.backend_cices_system.data;
import org.example.backend_cices_system.logic.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Short> {

    @Query("""
  select u from Usuario u
  join fetch u.idEmpleado e
  where upper(u.nombreUsuario)=upper(:username) and u.activo=1
""")
    Optional<Usuario> findActiveByUsername(@Param("username") String username);

}

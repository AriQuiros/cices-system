package org.example.backend_cices_system.modules.usuario.repository;
import org.example.backend_cices_system.modules.usuario.model.RolUsuario;
import org.example.backend_cices_system.modules.usuario.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface RolUsuarioRepository extends JpaRepository<RolUsuario, Short> {
    @Query("select ru.idRol.nombreRol from RolUsuario ru where ru.idUsuario.id = :userId")
    List<String> findRoleNamesByUsuarioId(@Param("userId") Integer userId);

    List<RolUsuario> findByIdUsuario(Usuario idUsuario);
    List<RolUsuario> findByIdRol_NombreRolContainingIgnoreCase(String idRolNombreRol);
}
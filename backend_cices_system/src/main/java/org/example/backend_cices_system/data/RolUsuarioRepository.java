package org.example.backend_cices_system.data;
import org.example.backend_cices_system.logic.RolUsuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface RolUsuarioRepository extends JpaRepository<RolUsuario, Short> {
    @Query("select ru.idRol.nombreRol from RolUsuario ru where ru.idUsuario.id = :userId")
    List<String> findRoleNamesByUsuarioId(@Param("userId") Short userId);

    @Query("""
    select count(distinct ru.idUsuario.id)
    from RolUsuario ru
    where ru.idUsuario.activo = 1 and upper(ru.idRol.nombreRol) = 'INVESTIGADOR'
  """)
    long countInvestigadoresActivos();

    @Query("""
    select count(distinct ru.idUsuario.id)
    from RolUsuario ru
    where ru.idUsuario.activo = 1 and upper(ru.idRol.nombreRol) in ('ADMINISTRADOR','ASISTENTE')
  """)
    long countPersonalAdministrativo();

}
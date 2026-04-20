package org.example.backend_cices_system.report.dao;

import org.example.backend_cices_system.report.view.RepPersonaUsuaria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface RepPersonaUsuariaRepository extends
        JpaRepository<RepPersonaUsuaria, Integer>,
        JpaSpecificationExecutor<RepPersonaUsuaria> {

     Optional<RepPersonaUsuaria> findFirstByIdUsuario(Integer idUsuario);
     @Query("""
         SELECT r.idUsuario, r.nombreRol
         FROM RepPersonaUsuaria r
         WHERE r.idUsuario IN :ids
    """)
     List<Object[]> findRolesByUsuarios(List<Integer> ids);
}
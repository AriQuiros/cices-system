package org.example.backend_cices_system.report.dao;

import org.example.backend_cices_system.report.view.RepPersonaBase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RepPersonaBaseRepository extends JpaRepository<RepPersonaBase, Integer> {

    List<RepPersonaBase> findAll();

    RepPersonaBase findByIdentificacion(String identificacion);

    List<RepPersonaBase> findByNombreCompletoContainingIgnoreCase(String nombreCompleto);

    List<RepPersonaBase> findByCorreoContainingIgnoreCase(String correo);

    List<RepPersonaBase> findByPais(String pais);

    List<RepPersonaBase> findByGradoAcademico(String gradoAcademico);
}

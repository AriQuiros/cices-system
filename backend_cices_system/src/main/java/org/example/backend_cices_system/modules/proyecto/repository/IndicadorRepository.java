package org.example.backend_cices_system.modules.proyecto.repository;

import org.example.backend_cices_system.modules.proyecto.model.Indicador;
import org.example.backend_cices_system.modules.proyecto.model.Meta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IndicadorRepository extends JpaRepository<Indicador, Integer> {
    List<Indicador> findIndicadorByIdMeta(Meta idMeta);
}

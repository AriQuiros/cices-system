package org.example.backend_cices_system.repository.entity;

import org.example.backend_cices_system.model.entity.Indicador;
import org.example.backend_cices_system.model.entity.Meta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IndicadorRepository extends JpaRepository<Indicador, Integer> {
    List<Indicador> findIndicadorByIdMeta(Meta idMeta);
}

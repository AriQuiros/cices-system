package org.example.backend_cices_system.data;

import org.example.backend_cices_system.logic.Indicador;
import org.example.backend_cices_system.logic.Meta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IndicadorRepository extends JpaRepository<Indicador, Integer> {
    List<Indicador> findIndicadorByIdMeta(Meta idMeta);
}

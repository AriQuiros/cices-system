package org.example.backend_cices_system.repository.entity;

import org.example.backend_cices_system.model.entity.Investigador;
import org.example.backend_cices_system.model.entity.Titulo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TituloRepository extends JpaRepository <Titulo, Integer> {
    List<Titulo> findByIdInvestigador(Investigador investigador);
}

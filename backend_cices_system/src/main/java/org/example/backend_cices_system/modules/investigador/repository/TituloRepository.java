package org.example.backend_cices_system.modules.investigador.repository;

import org.example.backend_cices_system.modules.investigador.model.Investigador;
import org.example.backend_cices_system.modules.investigador.model.Titulo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TituloRepository extends JpaRepository <Titulo, Integer> {
    List<Titulo> findByIdInvestigador(Investigador investigador);
}

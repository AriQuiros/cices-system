package org.example.backend_cices_system.data;

import org.example.backend_cices_system.logic.Investigador;
import org.example.backend_cices_system.logic.Titulo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TituloRepository extends JpaRepository <Titulo, Integer> {
    Optional<Titulo> findByIdInvestigador(Investigador investigador);
}

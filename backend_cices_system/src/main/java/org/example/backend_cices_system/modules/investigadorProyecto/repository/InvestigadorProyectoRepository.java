package org.example.backend_cices_system.modules.investigadorProyecto.repository;

import org.example.backend_cices_system.modules.investigador.model.Investigador;
import org.example.backend_cices_system.modules.investigadorProyecto.model.InvestigadorProyecto;
import org.example.backend_cices_system.modules.proyecto.model.Proyecto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InvestigadorProyectoRepository extends JpaRepository<InvestigadorProyecto, Integer> {
    Optional<InvestigadorProyecto> findByIdProyectoAndIdInvestigador(Proyecto proyecto, Investigador investigador);
    List<InvestigadorProyecto> findByIdProyecto(Proyecto proyectoId);
}

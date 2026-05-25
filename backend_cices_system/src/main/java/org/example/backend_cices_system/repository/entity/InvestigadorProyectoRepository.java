package org.example.backend_cices_system.repository.entity;

import org.example.backend_cices_system.model.entity.Investigador;
import org.example.backend_cices_system.model.entity.InvestigadorProyecto;
import org.example.backend_cices_system.model.entity.Proyecto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InvestigadorProyectoRepository extends JpaRepository<InvestigadorProyecto, Integer> {
    Optional<InvestigadorProyecto> findByIdProyectoAndIdInvestigador(Proyecto proyecto, Investigador investigador);
    List<InvestigadorProyecto> findByIdProyecto(Proyecto proyectoId);
}

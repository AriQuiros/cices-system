package org.example.backend_cices_system.modules.proyecto.repository;

import org.example.backend_cices_system.modules.proyecto.model.ObjetivoEspecifico;
import org.example.backend_cices_system.modules.proyecto.model.Proyecto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ObjetivoEspecificoRepository extends JpaRepository<ObjetivoEspecifico, Integer> {
    List<ObjetivoEspecifico> findObjetivoEspecificoByIdProyecto(Proyecto idProyecto);
}

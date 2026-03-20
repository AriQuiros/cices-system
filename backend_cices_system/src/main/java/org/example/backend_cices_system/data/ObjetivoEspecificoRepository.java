package org.example.backend_cices_system.data;

import org.example.backend_cices_system.logic.ObjetivoEspecifico;
import org.example.backend_cices_system.logic.Proyecto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ObjetivoEspecificoRepository extends JpaRepository<ObjetivoEspecifico, Integer> {
    List<ObjetivoEspecifico> findObjetivoEspecificoByIdProyecto(Proyecto idProyecto);
}

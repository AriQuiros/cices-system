package org.example.backend_cices_system.data;

import org.example.backend_cices_system.logic.PresentacionInforme;
import org.example.backend_cices_system.logic.Proyecto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PresentacionInformeRepository extends JpaRepository<PresentacionInforme, Integer> {
    List<PresentacionInforme> findPresentacionInformeByIdProyecto(Proyecto proyecto);
}

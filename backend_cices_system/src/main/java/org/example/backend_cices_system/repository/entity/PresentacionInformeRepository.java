package org.example.backend_cices_system.repository.entity;

import org.example.backend_cices_system.model.entity.PresentacionInforme;
import org.example.backend_cices_system.model.entity.Proyecto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface PresentacionInformeRepository extends JpaRepository<PresentacionInforme, Integer> {
    List<PresentacionInforme> findPresentacionInformeByIdProyecto(Proyecto proyecto);

    List<PresentacionInforme> findByFechaPresentacionBetween(LocalDate inicio, LocalDate fin);

    List<PresentacionInforme> findByFechaPresentacionBeforeAndIdCodigoTipoEstado(
            LocalDate fecha, Short idCodigoTipoEstado);
}

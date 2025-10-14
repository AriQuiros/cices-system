package org.example.backend_cices_system.data;

import org.example.backend_cices_system.logic.HorasAsignada;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HorasAsignadaRepository extends JpaRepository<HorasAsignada, Short> {
    List<HorasAsignada> findByIdInvestigadorProyecto_IdProyecto_Id(Short proyectoId);

}

package org.example.backend_cices_system.data;

import org.example.backend_cices_system.logic.HorasAsignada;
import org.example.backend_cices_system.logic.InvestigadorProyecto;
import org.example.backend_cices_system.logic.RolProyecto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RolProyectoRepository extends JpaRepository<RolProyecto, Short> {

    @Query("select r from RolProyecto r order by r.nombrePermiso")
    List<RolProyecto> listar();

    // HorasAsignadasRepository.java
    public interface HorasAsignadasRepository extends JpaRepository<HorasAsignada, Short> {
        void deleteByIdInvestigadorProyecto(InvestigadorProyecto ip);
    }
}
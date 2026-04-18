package org.example.backend_cices_system.report.dao;

import org.example.backend_cices_system.report.view.RepInvestigadorTitulos;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RepInvestigadorTitulosRepository extends JpaRepository<RepInvestigadorTitulos, Integer> {

    List<RepInvestigadorTitulos> findByIdentificacion(String identificacion);

}

package org.example.backend_cices_system.consult.investigador.repository;

import org.example.backend_cices_system.consult.investigador.view.RepInvestigadorTitulos;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RepInvestigadorTitulosRepository extends JpaRepository<RepInvestigadorTitulos, Integer> {

    List<RepInvestigadorTitulos> findByIdentificacion(String identificacion);

}

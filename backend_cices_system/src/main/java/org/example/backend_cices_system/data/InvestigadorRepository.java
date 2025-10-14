package org.example.backend_cices_system.data;

import org.example.backend_cices_system.dto.InvestigadorDTO;
import org.example.backend_cices_system.logic.Empleado;
import org.example.backend_cices_system.logic.Investigador;
import org.example.backend_cices_system.logic.InvestigadorProyecto;
import org.example.backend_cices_system.logic.Proyecto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface InvestigadorRepository extends JpaRepository<Investigador,Short> {
    Optional<Investigador> findByIdEmpleado(Empleado empleado);

    @Query("""
       select new org.example.backend_cices_system.dto.InvestigadorDTO(i.id, e.nombreCompleto, i.unidadAcademica)
       from Investigador i join i.idEmpleado e
       where (:q is null or lower(e.nombreCompleto) like lower(concat(:q,'%')))
       order by e.nombreCompleto
    """)
    List<InvestigadorDTO> buscarInvestigadores(@Param("q") String q);



}

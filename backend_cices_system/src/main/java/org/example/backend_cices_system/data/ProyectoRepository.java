package org.example.backend_cices_system.data;

import org.example.backend_cices_system.dto.ProyectoDTO;
import org.example.backend_cices_system.dto.ProyectoMiniDTO;
import org.example.backend_cices_system.logic.Proyecto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface ProyectoRepository extends JpaRepository<Proyecto, Short> {
    Optional<Proyecto> findByCodigoProyecto(String codigoProyecto);
    List<Proyecto> findByIdCodigoEstado(Short idCodigoEstado);
    Proyecto findProyectoById(Short id);
    @Query("""
    select new org.example.backend_cices_system.dto.ProyectoMiniDTO(
      p.id, p.codigoProyecto, p.nombreProyecto)
    from Proyecto p
    where (:q is null or trim(:q) = '')
       or upper(p.codigoProyecto) like upper(concat(:q, '%'))
       or upper(p.nombreProyecto) like upper(concat('%', :q, '%'))
    order by p.codigoProyecto
  """)
    List<ProyectoMiniDTO> suggest(@Param("q") String q, org.springframework.data.domain.Pageable pg);
}

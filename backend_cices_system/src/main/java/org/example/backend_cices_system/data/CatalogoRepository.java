package org.example.backend_cices_system.data;

import org.example.backend_cices_system.logic.Codigo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CatalogoRepository extends JpaRepository<Codigo, Short> {
    List<Codigo> findByIdTipoNombreIn(List<String> nombresTipos);
    List<Codigo> findByIdTipoId(Short idTipo);
}

package org.example.backend_cices_system.data;

import org.example.backend_cices_system.dto.CodigoDTO;
import org.example.backend_cices_system.logic.Codigo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CatalogoRepository extends JpaRepository<Codigo, Short> {
    List<Codigo> findByIdTipoNombreIn(List<String> nombresTipos);
    List<Codigo> findByIdTipoId(Short idTipo);
    Optional<Codigo> findByIdTipoNombreAndValor(String nombre, String valor);
    CodigoDTO findCodigoById(Short id);

}

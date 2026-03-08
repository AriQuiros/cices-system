package org.example.backend_cices_system.data;

import org.example.backend_cices_system.logic.Codigo;
import org.example.backend_cices_system.logic.Tipo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CatalogoRepository extends JpaRepository<Codigo, Short> {
    List<Codigo> findByIdTipoNombreIn(List<String> nombresTipos);
    List<Codigo> findByIdTipo(Tipo idTipo);
    Optional<Codigo> findByIdTipoNombreIgnoreCaseAndValorIgnoreCase(String nombre, String valor);

}

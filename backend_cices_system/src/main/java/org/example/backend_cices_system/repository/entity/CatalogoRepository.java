package org.example.backend_cices_system.repository.entity;

import org.example.backend_cices_system.model.entity.Codigo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CatalogoRepository extends JpaRepository<Codigo, Short> {
    List<Codigo> findByIdTipoNombreIn(List<String> nombresTipos);
    List<Codigo> findCodigoByIdTipo_Nombre(String nombre);
    Optional<Codigo> findByIdTipoNombreIgnoreCaseAndValorIgnoreCase(String nombre, String valor);

}

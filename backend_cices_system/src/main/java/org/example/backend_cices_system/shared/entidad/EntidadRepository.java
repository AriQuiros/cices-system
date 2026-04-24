package org.example.backend_cices_system.shared.entidad;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EntidadRepository extends JpaRepository<Entidad, Integer> {
    List<Entidad> findByNombreContainingIgnoreCaseAndIdCodigoTipoEntidad(
            String nombre,
            Short tipoId,
            Pageable pageable
    );
}

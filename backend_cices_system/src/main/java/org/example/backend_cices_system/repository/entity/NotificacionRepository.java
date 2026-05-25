package org.example.backend_cices_system.repository.entity;

import org.example.backend_cices_system.model.entity.Notificacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface NotificacionRepository extends JpaRepository<Notificacion, Integer> {
    void deleteByFechaCreacionBefore(LocalDate fechaLimite);

    boolean existsByClaveAndFechaCreacion(String clave, LocalDate now);

    boolean existsByClave(String clave);

    Optional<Notificacion> findByClave(String clave);
}

package org.example.backend_cices_system.consult.notificacion;

import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class NotificacionSpecification {

    public static Specification<RepNotificacionesUsuario> filtrar(
            Integer idUsuario,
            NotificacionFiltroDTO filtro
    ) {
        return (root, query, cb) -> {

            List<Predicate> predicates = new ArrayList<>();

            // SIEMPRE — solo notificaciones del usuario autenticado
            predicates.add(cb.equal(root.get("idUsuario"), idUsuario));

            if (filtro == null) {
                return cb.and(predicates.toArray(new Predicate[0]));
            }

            // CATEGORÍA
            if (filtro.categoria() != null && !filtro.categoria().isBlank()) {
                predicates.add(
                        cb.equal(cb.lower(root.get("categoria")),
                                filtro.categoria().toLowerCase())
                );
            }

            // LEÍDO / NO LEÍDO
            if (filtro.leido() != null) {
                predicates.add(cb.equal(root.get("leido"), filtro.leido()));
            }

            // BÚSQUEDA LIBRE (asunto o mensaje)
            if (filtro.busqueda() != null && !filtro.busqueda().isBlank()) {
                String like = "%" + filtro.busqueda().toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("asunto")),  like),
                        cb.like(cb.lower(root.get("mensaje")), like)
                ));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
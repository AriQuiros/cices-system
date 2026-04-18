package org.example.backend_cices_system.report.specification;

import org.example.backend_cices_system.report.view.RepInvestigadorCertificaciones;
import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

public class CertificacionSpecification {

    public static Specification<RepInvestigadorCertificaciones> filtrar(
            String nombre,
            List<String> tipos,
            List<String> estados,
            String ordenFecha
    ) {
        return (root, query, cb) -> {

            List<Predicate> predicates = new ArrayList<>();

            // 🔹 NOMBRE (case insensitive)
            if (nombre != null && !nombre.isBlank()) {
                predicates.add(
                        cb.like(
                                cb.lower(root.get("nombreInvestigador")),
                                "%" + nombre.toLowerCase() + "%"
                        )
                );
            }

            // TIPOS
            if (tipos != null && !tipos.isEmpty()) {
                predicates.add(
                        root.get("tipoCertificacion").in(tipos)
                );
            }

            // ESTADOS
            if (estados != null && !estados.isEmpty()) {
                predicates.add(
                        root.get("estadoCertificacion").in(estados)
                );
            }

            // 🔹 ORDEN
            if (ordenFecha != null) {
                if ("desc".equalsIgnoreCase(ordenFecha)) {
                    query.orderBy(cb.desc(root.get("fechaExpiracion")));
                } else {
                    query.orderBy(cb.asc(root.get("fechaExpiracion")));
                }
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
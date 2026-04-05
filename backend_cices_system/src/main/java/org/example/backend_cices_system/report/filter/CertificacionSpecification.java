package org.example.backend_cices_system.report.filter;

import org.example.backend_cices_system.report.view.RepInvestigadorCertificaciones;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

public class CertificacionSpecification {

    public static Specification<RepInvestigadorCertificaciones> filtrar(
            String nombre,
            List<String> tipos,
            List<String> estados
    ) {
        return (root, query, cb) -> {

            var predicates = cb.conjunction();

            if (nombre != null && !nombre.isEmpty()) {
                predicates = cb.and(predicates,
                        cb.like(
                                cb.lower(root.get("nombreInvestigador")),
                                "%" + nombre.toLowerCase() + "%"
                        )
                );
            }

            if (tipos != null && !tipos.isEmpty()) {
                predicates = cb.and(predicates,
                        root.get("tipoCertificacion").in(tipos)
                );
            }

            if (estados != null && !estados.isEmpty()) {
                predicates = cb.and(predicates,
                        cb.upper(root.get("estadoCertificacion")).in(
                                estados.stream()
                                        .map(String::toUpperCase)
                                        .toList()
                        )
                );
            }

            return predicates;
        };
    }
}
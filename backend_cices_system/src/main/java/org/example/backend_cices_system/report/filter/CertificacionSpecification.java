package org.example.backend_cices_system.report.filter;

import org.example.backend_cices_system.report.view.RepInvestigadorCertificaciones;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

public class CertificacionSpecification {

    public static Specification<RepInvestigadorCertificaciones> filtrar(
            String nombre,
            List<Short> tipos,
            List<Short> estados,
            String ordenFecha
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
                        root.get("idCodigoTipoCertificacion").in(tipos)
                );
            }

            if (estados != null && !estados.isEmpty()) {
                predicates = cb.and(predicates,
                        root.get("idCodigoTipoEstado").in(estados)
                );
            }

            if ("desc".equalsIgnoreCase(ordenFecha)) {
                query.orderBy(cb.desc(root.get("fechaExpiracion")));
            } else {
                query.orderBy(cb.asc(root.get("fechaExpiracion")));
            }

            return predicates;
        };
    }
}
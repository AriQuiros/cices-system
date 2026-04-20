package org.example.backend_cices_system.report.specification;

import org.example.backend_cices_system.report.filter.CertificacionFiltroDTO;
import org.example.backend_cices_system.report.view.RepInvestigadorCertificaciones;
import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

public class CertificacionSpecification {

    public static Specification<RepInvestigadorCertificaciones> filtrar(
            CertificacionFiltroDTO filtro
    ) {
        return (root, query, cb) -> {

            List<Predicate> predicates = new ArrayList<>();

            if (filtro.investigador() != null && !filtro.investigador().isBlank()) {

                if (filtro.investigador().matches("\\d+")) {
                    //búsqueda exacta por identificación
                    predicates.add(
                            cb.equal(root.get("identificacion"), filtro.investigador())
                    );
                } else {
                    String like = "%" + filtro.investigador().toLowerCase() + "%";

                    Predicate porNombre = cb.like(
                            cb.lower(root.get("nombreInvestigador")), like);

                    Predicate porIdentificacion = cb.like(
                            cb.lower(root.get("identificacion")), like);

                    predicates.add(cb.or(porNombre, porIdentificacion));
                }
            }

            // Nombre de certificación
            if (filtro.nombreCertificacion() != null && !filtro.nombreCertificacion().isBlank()) {
                predicates.add(
                        cb.like(
                                cb.lower(root.get("nombreCertificacion")),
                                "%" + filtro.nombreCertificacion().toLowerCase() + "%"
                        )
                );
            }

            // Tipos
            if (filtro.tipos() != null && !filtro.tipos().isEmpty()) {
                predicates.add(root.get("tipoCertificacion").in(filtro.tipos()));
            }

            // Estados
            if (filtro.estados() != null && !filtro.estados().isEmpty()) {
                predicates.add(root.get("estadoCertificacion").in(filtro.estados()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
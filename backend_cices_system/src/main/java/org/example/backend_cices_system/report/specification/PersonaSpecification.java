package org.example.backend_cices_system.report.specification;

import jakarta.persistence.criteria.Predicate;
import org.example.backend_cices_system.report.filter.PersonaFiltroDTO;
import org.example.backend_cices_system.report.view.RepPersonaUsuaria;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class PersonaSpecification {

    public static Specification<RepPersonaUsuaria> filtrar(PersonaFiltroDTO filtro) {
        return (root, query, cb) -> {

            List<Predicate> predicates = new ArrayList<>();

            if (filtro.nombre() != null && !filtro.nombre().isBlank()) {
                predicates.add(
                        cb.like(
                                cb.lower(root.get("nombreCompleto")),
                                "%" + filtro.nombre().toLowerCase() + "%"
                        )
                );
            }

            if (filtro.roles() != null && !filtro.roles().isEmpty()) {
                predicates.add(root.get("nombreRol").in(filtro.roles()));
            }

            if (filtro.gradosAcademicos() != null && !filtro.gradosAcademicos().isEmpty()) {
                predicates.add(root.get("gradoAcademico").in(filtro.gradosAcademicos()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}

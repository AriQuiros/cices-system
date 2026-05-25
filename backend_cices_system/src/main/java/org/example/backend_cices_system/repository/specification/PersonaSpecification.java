package org.example.backend_cices_system.repository.specification;

import jakarta.persistence.criteria.Predicate;
import org.example.backend_cices_system.dto.filter.PersonaFiltroDTO;
import org.example.backend_cices_system.model.view.RepPersonaUsuaria;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class PersonaSpecification {

    public static Specification<RepPersonaUsuaria> filtrar(PersonaFiltroDTO filtro) {
        return (root, query, cb) -> {

            assert query != null;
            query.distinct(true);

            List<Predicate> predicates = new ArrayList<>();

            if (filtro.nombre() != null && !filtro.nombre().isBlank()) {
                String like = "%" + filtro.nombre().toLowerCase() + "%";

                Predicate porNombre = cb.like(
                        cb.lower(root.get("nombreCompleto")),
                        like
                );

                Predicate porIdentificacion = cb.like(
                        cb.lower(root.get("identificacion")),
                        like
                );

                predicates.add(cb.or(porNombre, porIdentificacion));
            }

            if (filtro.roles() != null && !filtro.roles().isEmpty()) {
                predicates.add(root.get("nombreRol").in(filtro.roles()));
            }

            if (filtro.gradosAcademicos() != null && !filtro.gradosAcademicos().isEmpty()) {
                predicates.add(root.get("gradoAcademico").in(filtro.gradosAcademicos()));
            }

            if (filtro.activo() != null) {
                predicates.add(cb.equal(root.get("activo"), filtro.activo()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}

package org.example.backend_cices_system.report.filter;

import org.example.backend_cices_system.logic.Proyecto;
import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.*;
import java.util.List;

public class ProyectoSpecification {

    public static Specification<Proyecto> conFiltros(
            String texto,
            Short estado,
            List<Short> tipos,
            List<String> lineas,
            String institucion
    ) {
        return (Root<Proyecto> root, CriteriaQuery<?> query, CriteriaBuilder cb) -> {

            Predicate predicate = cb.conjunction(); // AND base

            if (texto != null && !texto.isEmpty()) {
                String like = "%" + texto.toLowerCase() + "%";

                Predicate nombre = cb.like(cb.lower(root.get("nombreProyecto")), like);
                Predicate codigo = cb.like(cb.lower(root.get("codigoProyecto")), like);

                predicate = cb.and(predicate, cb.or(nombre, codigo));
            }

            if (tipos != null && !tipos.isEmpty()) {
                CriteriaBuilder.In<Short> inClause = cb.in(root.get("idCodigoTipoProyecto"));
                tipos.forEach(inClause::value);

                predicate = cb.and(predicate, inClause);
            }

            if (estado != null) {
                predicate = cb.and(predicate, cb.equal(root.get("idCodigoTipoEstado"), estado));
            }

            if (lineas != null && !lineas.isEmpty()) {
                CriteriaBuilder.In<String> inClause = cb.in(root.get("lineaInvestigacion"));
                lineas.forEach(inClause::value);

                predicate = cb.and(predicate, inClause);
            }

            /*if (institucion != null && !institucion.isEmpty()) {
                predicate = cb.and(predicate,
                        cb.like(cb.lower(root.get("institucion")),
                                "%" + institucion.toLowerCase() + "%"));
            }*/

            return predicate;
        };
    }
}
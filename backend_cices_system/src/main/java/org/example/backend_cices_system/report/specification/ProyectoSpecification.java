package org.example.backend_cices_system.report.specification;

import org.example.backend_cices_system.report.view.RepProyectoBase;
import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.*;

import java.util.ArrayList;
import java.util.List;

public class ProyectoSpecification {

    public static Specification<RepProyectoBase> filtrar(
            String texto,
            String estado,
            List<String> tipos,
            List<String> lineas
    ) {
        return (root, query, cb) -> {

            List<Predicate> predicates = new ArrayList<>();

            // TEXTO
            if (texto != null && !texto.isBlank()) {
                String like = "%" + texto.toLowerCase() + "%";

                predicates.add(
                        cb.or(
                                cb.like(cb.lower(root.get("nombreProyecto")), like),
                                cb.like(cb.lower(root.get("codigoProyecto")), like)
                        )
                );
            }

            // TIPOS
            if (tipos != null && !tipos.isEmpty()) {
                predicates.add(root.get("tipoProyecto").in(tipos));
            }

            // ESTADO
            if (estado != null && !estado.isBlank()) {
                predicates.add(cb.equal(root.get("estadoProyecto"), estado));
            }

            // LINEAS
            if (lineas != null && !lineas.isEmpty()) {
                predicates.add(root.get("lineaInvestigacion").in(lineas));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
package org.example.backend_cices_system.repository.specification;

import org.example.backend_cices_system.dto.filter.ProyectoFiltroDTO;
import org.example.backend_cices_system.model.view.RepProyectoBase;
import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.*;

import java.util.ArrayList;
import java.util.List;

public class ProyectoSpecification {

    public static Specification<RepProyectoBase> filtrar(
            ProyectoFiltroDTO filtro
    ) {
        return (root, query, cb) -> {

            List<Predicate> predicates = new ArrayList<>();

            // TEXTO
            if (filtro.texto() != null && !filtro.texto().isBlank()) {
                String like = "%" + filtro.texto().toLowerCase() + "%";

                predicates.add(
                        cb.or(
                                cb.like(cb.lower(root.get("nombreProyecto")), like),
                                cb.like(cb.lower(root.get("codigoProyecto")), like)
                        )
                );
            }

            // TIPOS
            if (filtro.tipos() != null && !filtro.tipos().isEmpty()) {
                predicates.add(root.get("tipoProyecto").in(filtro.tipos()));
            }

            // ESTADO
            if (filtro.estado() != null && !filtro.estado().isBlank()) {
                predicates.add(cb.equal(root.get("estadoProyecto"), filtro.estado()));
            }

            // LINEAS
            if (filtro.lineas() != null && !filtro.lineas().isEmpty()) {
                predicates.add(root.get("lineaInvestigacion").in(filtro.lineas()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
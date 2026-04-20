package org.example.backend_cices_system.report.specification;

import org.example.backend_cices_system.report.filter.PresupuestoFiltroDTO;
import org.example.backend_cices_system.report.view.RepPresupuestoBase;
import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

public class PresupuestoSpecification {

    public static Specification<RepPresupuestoBase> filtrar(
            PresupuestoFiltroDTO filtro
    ) {
        return (root, query, cb) -> {

            List<Predicate> predicates = new ArrayList<>();

            // Búsqueda libre (descripcion OR categoria)
            if (filtro.busqueda() != null && !filtro.busqueda().isBlank()) {
                String like = "%" + filtro.busqueda().toLowerCase() + "%";

                Predicate porDescripcion = cb.like(
                        cb.lower(root.get("descripcion")), like);

                Predicate porCategoria = cb.like(
                        cb.lower(root.get("categoriaPresupuesto")), like);

                predicates.add(cb.or(porDescripcion, porCategoria));
            }

            if (filtro.tiposPresupuesto() != null && !filtro.tiposPresupuesto().isEmpty()) {
                predicates.add(root.get("tipoPresupuesto").in(filtro.tiposPresupuesto()));
            }

            if (filtro.fuentesFinanciamiento() != null && !filtro.fuentesFinanciamiento().isEmpty()) {
                predicates.add(root.get("fuenteFinanciamiento").in(filtro.fuentesFinanciamiento()));
            }

            if (filtro.categorias() != null && !filtro.categorias().isEmpty()) {
                predicates.add(root.get("categoriaPresupuesto").in(filtro.categorias()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}

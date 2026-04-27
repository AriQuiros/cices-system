package org.example.backend_cices_system.consult.presupuesto.specification;

import org.example.backend_cices_system.consult.presupuesto.dto.PresupuestoFiltroDTO;
import org.example.backend_cices_system.consult.presupuesto.view.RepPresupuestoBase;
import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

public class PresupuestoSpecification {

    public static Specification<RepPresupuestoBase> filtrar(PresupuestoFiltroDTO filtro) {
        return (root, query, cb) -> {

            List<Predicate> predicates = new ArrayList<>();

            if (filtro.busqueda() != null && !filtro.busqueda().isBlank()) {
                String like = "%" + filtro.busqueda().toLowerCase() + "%";

                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("descripcionPresupuesto")), like),
                        cb.like(cb.lower(root.get("categoriaPresupuesto")), like)
                ));
            }

            if (filtro.codigoProyecto() != null) {
                predicates.add(cb.equal(root.get("codigoProyecto"), filtro.codigoProyecto()));
            }

            if (filtro.tipoPresupuesto() != null) {
                predicates.add(cb.equal(root.get("tipoPresupuesto"), filtro.tipoPresupuesto()));
            }

            if (filtro.fuentesFinanciamiento() != null && !filtro.fuentesFinanciamiento().isEmpty()) {
                predicates.add(root.get("fuenteFinanciamiento").in(filtro.fuentesFinanciamiento()));
            }

            if (filtro.categorias() != null && !filtro.categorias().isEmpty()) {
                predicates.add(root.get("categoriaPresupuesto").in(filtro.categorias()));
            }

            if (filtro.fechaDesde() != null && filtro.fechaHasta() != null) {
                predicates.add(
                        cb.between(
                                root.get("fechaAsignacion"),
                                filtro.fechaDesde(),
                                filtro.fechaHasta()
                        )
                );
            }

            if (filtro.fechaDesde() != null) {
                predicates.add(
                        cb.greaterThanOrEqualTo(
                                root.get("fechaAsignacion"),
                                filtro.fechaDesde()
                        )
                );
            }

            if (filtro.fechaHasta() != null) {
                predicates.add(
                        cb.lessThanOrEqualTo(
                                root.get("fechaAsignacion"),
                                filtro.fechaHasta()
                        )
                );
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}

package org.example.backend_cices_system.consult.presupuesto.specification;

import org.example.backend_cices_system.consult.presupuesto.dto.PresupuestoFiltroDTO;
import org.example.backend_cices_system.consult.presupuesto.view.RepPresupuestoBase;
import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Predicate;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class PresupuestoSpecification {

    public static Specification<RepPresupuestoBase> filtrarConProyectos(
            PresupuestoFiltroDTO filtro,
            List<Integer> idsProyecto
    ) {
        return (root, query, cb) -> {

            List<Predicate> predicates = new ArrayList<>();

            // Proyectos acotados
            if (idsProyecto != null && !idsProyecto.isEmpty()) {
                predicates.add(root.get("idProyecto").in(idsProyecto));
            }

            // Reutilizar todos los predicados del filtro base
            Specification<RepPresupuestoBase> base = filtrar(filtro);
            Predicate basePredicate = base.toPredicate(root, query, cb);
            if (basePredicate != null) predicates.add(basePredicate);

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

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

            if (filtro.tipoPresupuesto() != null && !filtro.tipoPresupuesto().isBlank()) {
                predicates.add(cb.equal(root.get("tipoPresupuesto"), filtro.tipoPresupuesto()));
            }

            if (filtro.fuentesFinanciamiento() != null && !filtro.fuentesFinanciamiento().isEmpty()) {
                predicates.add(root.get("fuenteFinanciamiento").in(filtro.fuentesFinanciamiento()));
            }

            if (filtro.categorias() != null && !filtro.categorias().isEmpty()) {
                predicates.add(root.get("categoriaPresupuesto").in(filtro.categorias()));
            }

            if (filtro.anioDesde() != null || filtro.anioHasta() != null) {
                LocalDate desde = filtro.anioDesde() != null
                        ? LocalDate.of(filtro.anioDesde(), 1, 1)
                        : LocalDate.of(2020, 1, 1);

                LocalDate hasta = filtro.anioHasta() != null
                        ? LocalDate.of(filtro.anioHasta(), 12, 31)
                        : LocalDate.now();

                predicates.add(
                        cb.between(root.get("fechaAsignacion"), desde, hasta)
                );
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}

package org.example.backend_cices_system.consult.proyecto.specification;

import org.example.backend_cices_system.consult.proyecto.view.RepInvestigadorProyecto;
import org.example.backend_cices_system.consult.proyecto.dto.ProyectoFiltroDTO;
import org.example.backend_cices_system.consult.proyecto.dto.InvestigadorProyectoFiltroDTO;
import org.springframework.data.jpa.domain.Specification;

public class InvestigadorProyectoSpecification {

    public static Specification<RepInvestigadorProyecto> filtrar(
            ProyectoFiltroDTO proyectoFiltro,
            InvestigadorProyectoFiltroDTO investigadorFiltro
    ) {
        return (root, query, cb) -> {

            var predicate = cb.conjunction();

            // INVESTIGADOR
            if (investigadorFiltro.idInvestigador() != null) {
                predicate = cb.and(predicate,
                        cb.equal(root.get("idInvestigador"), investigadorFiltro.idInvestigador()));
            }

            // ROL
            if (investigadorFiltro.rol() != null && !investigadorFiltro.rol().isBlank()) {
                predicate = cb.and(predicate,
                        cb.equal(cb.lower(root.get("rolProyecto")),
                                investigadorFiltro.rol().toLowerCase()));
            }

            // FECHA DESDE
            if (investigadorFiltro.desde() != null) {
                predicate = cb.and(predicate,
                        cb.greaterThanOrEqualTo(
                                root.get("fechaInicioInvestigador"),
                                investigadorFiltro.desde()));
            }

            // FECHA HASTA
            if (investigadorFiltro.hasta() != null) {
                predicate = cb.and(predicate,
                        cb.lessThanOrEqualTo(
                                root.get("fechaFinInvestigador"),
                                investigadorFiltro.hasta()));
            }

            // FILTRADO DE PROYECTO

            // TEXTO (nombre o código)
            if (proyectoFiltro.texto() != null && !proyectoFiltro.texto().isBlank()) {
                String like = "%" + proyectoFiltro.texto().toLowerCase() + "%";

                predicate = cb.and(predicate,
                        cb.or(
                                cb.like(cb.lower(root.get("nombreProyecto")), like),
                                cb.like(cb.lower(root.get("codigoProyecto")), like)
                        ));
            }

            // ESTADO
            if (proyectoFiltro.estado() != null && !proyectoFiltro.estado().isBlank()) {
                predicate = cb.and(predicate,
                        cb.equal(cb.lower(root.get("estadoProyecto")),
                                proyectoFiltro.estado().toLowerCase()));
            }

            // TIPOS
            if (proyectoFiltro.tipos() != null && !proyectoFiltro.tipos().isEmpty()) {
                predicate = cb.and(predicate,
                        root.get("tipoProyecto").in(proyectoFiltro.tipos()));
            }

            // LÍNEAS
            if (proyectoFiltro.lineas() != null && !proyectoFiltro.lineas().isEmpty()) {
                predicate = cb.and(predicate,
                        root.get("lineaInvestigacion").in(proyectoFiltro.lineas()));
            }

            return predicate;
        };
    }
}
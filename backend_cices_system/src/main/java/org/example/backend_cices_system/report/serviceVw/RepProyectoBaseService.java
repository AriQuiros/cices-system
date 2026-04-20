package org.example.backend_cices_system.report.serviceVw;

import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.dto.ProyectoDatosDTO;
import org.example.backend_cices_system.dto.ProyectoFechasDTO;
import org.example.backend_cices_system.report.dao.RepProyectoBaseRepository;
import org.example.backend_cices_system.report.filter.ProyectoFiltroDTO;
import org.example.backend_cices_system.report.specification.ProyectoSpecification;
import org.example.backend_cices_system.report.view.RepProyectoBase;
import org.example.backend_cices_system.reportes.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RepProyectoBaseService {

    private final RepProyectoBaseRepository repo;

    // ── Lecturas generales ───────────────────────────────────────────────────
    public RepProyectoBase buscarPorId(Integer idProyecto) {
        return repo.findById(idProyecto)
                .orElseThrow(() -> new RuntimeException("Proyecto no encontrado con ID: " + idProyecto));
    }

    public Page<RepProyectoBase> obtenerTodos(Specification<RepProyectoBase> spec, Pageable pageable) {
        return repo.findAll(spec, pageable);
    }

    public Page<ProyectoFechasDTO> obtenerProyectosFechasDTOs(ProyectoFiltroDTO filtroDTO, Pageable pageable) {
        return obtenerTodos(ProyectoSpecification.filtrar(filtroDTO), pageable)
                .map(this::obtenerProyectoFechasDTO);
    }

    // ── Filtros con paginación (para listados UI) ────────────────────────────

    public Page<RepProyectoBase> obtenerPorIdsConFiltro(
            List<Integer> ids,
            ProyectoFiltroDTO filtro,
            Pageable pageable
    ) {

        if (ids == null || ids.isEmpty()) {
            return Page.empty(pageable);
        }

        Specification<RepProyectoBase> spec = (root, query, cb) -> {

            // filtro por IDs
            Predicate porIds = root.get("idProyecto").in(ids);

            // filtro normal
            Predicate base = ProyectoSpecification
                    .filtrar(filtro)
                    .toPredicate(root, query, cb);

            return cb.and(porIds, base);
        };

        return repo.findAll(spec, pageable);
    }

    public Page<ProyectoDatosDTO> buscarConFiltros(ProyectoFiltroDTO filtroDTO, Pageable pageable) {

        return repo.findAll(ProyectoSpecification.filtrar(filtroDTO), pageable)
                .map(p -> new ProyectoDatosDTO(
                        p.getIdProyecto(),
                        p.getCodigoProyecto(),
                        p.getNombreProyecto(),
                        p.getLineaInvestigacion(),
                        p.getTipoProyecto(),
                        p.getEstadoProyecto(),
                        p.getFechaInicio(),
                        p.getFechaFinalizacion()
                ));
    }

    /**
     * Devuelve TODOS los IDs que cumplen los filtros, sin paginación.
     * Usado exclusivamente para exportación.
     * El límite de volumen lo valida el orquestador, no este método.
     */
    public List<Integer> buscarIdsPorFiltros(ProyectoFiltroDTO filtroDTO) {

        return repo.findAll(ProyectoSpecification.filtrar(filtroDTO))
                .stream()
                .map(RepProyectoBase::getIdProyecto)
                .toList();
    }

    // ── Búsqueda por IDs (para orquestador y uso interno) ───────────────────

    public List<RepProyectoBase> buscarPorIds(List<Integer> idsProyectos) {
        return repo.findByIdProyectoIn(idsProyectos);
    }

    // ── Métodos para uso individual (NO usar en batch) ───────────────────────

    /**
     * ADVERTENCIA: no usar este método dentro de un loop.
     * Para múltiples proyectos, usar obtenerPorProyectos(ids).
     */
    public List<ProyectoFechasDTO> obtenerPorProyecto(Integer idProyecto) {
        if (idProyecto == null) return List.of();

        List<RepProyectoBase> filas = repo.findByIdProyecto(idProyecto);
        if (filas == null || filas.isEmpty()) return List.of();

        return filas.stream()
                .map(this::obtenerProyectoFechasDTO)
                .toList();
    }

    // ── Mapeos a DTO ─────────────────────────────────────────────────────────

    public ProyectoFechasDTO obtenerProyectoFechasDTO(RepProyectoBase p) {
        return new ProyectoFechasDTO(
                p.getCodigoProyecto(),
                p.getNombreProyecto(),
                p.getFechaInicio(),
                p.getFechaFinalizacion()
        );
    }

    /**
     * Ensambla el DTO de reporte completo de un proyecto.
     * Este método es puro (sin queries): solo mapea campos y listas ya cargadas.
     * Llamarlo desde el orquestador, nunca en loop con queries adentro.
     */
    public ProyectoReporteDTO obtenerProyectoReporteDTO(
            RepProyectoBase proyecto,
            List<InvestigadorReporteDTO> investigadores,
            List<EntidadReporteDTO> entidades,
            List<PresupuestoReporteDTO> presupuestos,
            List<ObjetivoReporteDTO> objetivos,
            List<DocumentoReporteDTO> documentos,
            List<InformeReporteDTO> informes
    ) {
        return new ProyectoReporteDTO(
                proyecto.getCodigoProyecto(),
                proyecto.getNombreProyecto(),
                proyecto.getDescripcionProyecto(),
                proyecto.getObjetivoGeneral(),
                proyecto.getLineaInvestigacion(),
                proyecto.getTipoProyecto(),
                proyecto.getEstadoProyecto(),
                proyecto.getFechaInicio(),
                proyecto.getFechaFinalizacion(),
                investigadores,
                entidades,
                presupuestos,
                objetivos,
                documentos,
                informes
        );
    }
}

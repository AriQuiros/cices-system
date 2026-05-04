package org.example.backend_cices_system.export.service;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.consult.presupuesto.service.RepPresupuestoBaseService;
import org.example.backend_cices_system.consult.presupuesto.service.RepPresupuestoGastosService;
import org.example.backend_cices_system.consult.presupuesto.service.RepPresupuestoHorasService;
import org.example.backend_cices_system.consult.proyecto.service.RepInvestigadorProyectoService;
import org.example.backend_cices_system.consult.proyecto.service.RepProyectoBaseService;
import org.example.backend_cices_system.consult.proyecto.service.RepProyectoPresentacionInformeService;
import org.example.backend_cices_system.consult.proyecto.service.RepProyectoResultadosService;
import org.example.backend_cices_system.export.dto.*;
import org.example.backend_cices_system.consult.proyecto.dto.ProyectoFiltroDTO;
import org.example.backend_cices_system.consult.presupuesto.view.RepPresupuestoBase;
import org.example.backend_cices_system.consult.proyecto.view.RepProyectoBase;
import org.example.backend_cices_system.modules.proyecto.dto.DocumentoDTO;
import org.example.backend_cices_system.modules.proyecto.service.DocumentoService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * Orquestador de reportes de proyectos.
 *
 * GARANTÍA: exactamente 7/9 queries a BD por llamada a ensamblar(),
 * sin importar cuántos proyectos se procesen en el lote.
 *
 * Query 1 → rep_proyecto_base          (proyectos)
 * Query 2 → rep_investigador_proyecto   (investigadores)
 * Query 3 → rep_proyecto_resultados     (objetivos → metas → indicadores)
 * Query 4 → rep_proyecto_informe        (informes)
 * Query 5 → rep_presupuesto_base        (presupuestos)
 * Query 6 → rep_presupuesto_gastos      (gastos, agrupados por idPresupuesto)
 * Query 7 → rep_presupuesto_horas       (horas, agrupadas por idPresupuesto)
 *
 * Entidades: pendiente de implementar su vista/service.
 * Documentos: pendiente de implementar su vista/service.
 */
@Service
@RequiredArgsConstructor
public class ProyectoReporteOrquestador {

    private static final int MAX_PROYECTOS_POR_REPORTE = 300;

    // ── Services ────────────────────────────────────────────────────────────
    private final RepProyectoBaseService proyectoService;
    private final RepInvestigadorProyectoService investigadorService;
    private final RepProyectoResultadosService resultadosService;
    private final RepProyectoPresentacionInformeService informeService;
    private final RepPresupuestoBaseService presupuestoService;
    private final RepPresupuestoGastosService gastosService;
    private final RepPresupuestoHorasService horasService;
    private final DocumentoService documentoService;

    // ════════════════════════════════════════════════════════════════════════
    // PUNTO DE ENTRADA — múltiples proyectos por IDs
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Ensambla el DTO completo para una lista de IDs de proyectos.
     * Usa batch loading: 1 query por dominio, join en memoria.
     */
    public List<ProyectoReporteDTO> ensamblar(List<Integer> ids) {
        validarTamano(ids);

        // ── Query 1: proyectos base ──────────────────────────────────────────
        List<RepProyectoBase> proyectos = proyectoService.buscarPorIds(ids);

        if (proyectos.isEmpty()) return List.of();

        // ids reales después de filtrar (puede que alguno no exista en la vista)
        List<Integer> idsReales = proyectos.stream()
                .map(RepProyectoBase::getIdProyecto)
                .toList();

        // ── Queries 2-4: datos directos por idProyecto ─────────────────────
        Map<Integer, List<InvestigadorReporteDTO>> investigadoresPorProyecto =
                investigadorService.obtenerPorProyectos(idsReales);                // Query 2

        Map<Integer, List<ObjetivoReporteDTO>> objetivosPorProyecto =
                resultadosService.obtenerPorProyectos(idsReales);                  // Query 3

        Map<Integer, List<InformeReporteDTO>> informesPorProyecto =
                informeService.obtenerPorProyectos(idsReales);                     // Query 4

        // ── Query 5: presupuestos agrupados por idProyecto ──────────────────
        Map<Integer, List<RepPresupuestoBase>> presupuestosPorProyecto =
                presupuestoService.obtenerPorProyectos(idsReales);                 // Query 5

        // ── Queries 6-7: gastos y horas agrupados por idPresupuesto ─────────
        // IMPORTANTE: el parámetro son idsProyectos, pero el Map resultante
        // tiene como clave idPresupuesto. Esto es intencional: el join se hace
        // en ensamblarPresupuestos() usando presupuesto.getIdPresupuesto().
        Map<Integer, List<GastoReporteDTO>> gastosPorPresupuesto =
                gastosService.obtenerPorProyectos(idsReales);                      // Query 6

        Map<Integer, List<HorasAsignadasReporteDTO>> horasPorPresupuesto =
                horasService.obtenerPorProyectos(idsReales);                       // Query 7

        Map<Integer, List<DocumentoDTO>> documentosPorProyecto =
                documentoService.obtenerPorProyectos(idsReales); // Query 8

        // ── Ensamblaje en memoria (0 queries adicionales) ───────────────────
        return proyectos.stream()
                .map(p -> ensamblarProyecto(
                        p,
                        investigadoresPorProyecto,
                        objetivosPorProyecto,
                        informesPorProyecto,
                        presupuestosPorProyecto,
                        gastosPorPresupuesto,
                        horasPorPresupuesto,
                        documentosPorProyecto
                ))
                .toList();
    }

    // ════════════════════════════════════════════════════════════════════════
    // PUNTO DE ENTRADA — un solo proyecto
    // ════════════════════════════════════════════════════════════════════════

    public ProyectoReporteDTO ensamblarUnoOptimizado(String codigoProyecto) {

        RepProyectoBase proyecto = proyectoService.buscarPorCodigo(codigoProyecto);

        var idProyecto = proyecto.getIdProyecto();

        List<InvestigadorReporteDTO> investigadores =
                investigadorService.obtenerPorProyecto(idProyecto);

        List<ObjetivoReporteDTO> objetivos =
                resultadosService.obtenerPorProyecto(idProyecto);

        List<InformeReporteDTO> informes =
                informeService.obtenerPorProyecto(idProyecto);

        List<RepPresupuestoBase> presupuestos =
                presupuestoService.obtenerPorProyecto(idProyecto);

        // CORREGIR!!!
        List<PresupuestoReporteDTO> presupuestosDTO = presupuestos.stream()
                .map(pb -> presupuestoService.obtenerPresupuestoReporteDTO(
                        pb,
                        gastosService.obtenerPorProyecto(idProyecto), // ⚠️ aquí cuidado
                        horasService.obtenerPorProyecto(idProyecto)
                ))
                .toList();

        List<DocumentoDTO> documentos = documentoService.documentosPorIdProyecto(idProyecto);
        return proyectoService.obtenerProyectoReporteDTO(
                proyecto,
                investigadores,
                List.of(),
                presupuestosDTO,
                objetivos,
                documentos,
                informes
        );
    }

    // ════════════════════════════════════════════════════════════════════════
    // PUNTO DE ENTRADA — con filtros (para ExportService)
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Carga proyectos aplicando filtros y luego ensambla el DTO completo.
     * Separar la selección de IDs del ensamblaje mantiene cada responsabilidad
     * en su lugar: filtros en RepProyectoBaseService, joins aquí.
     */
    public List<ProyectoReporteDTO> ensamblarConFiltros(ProyectoFiltroDTO filtro) {

        // Sin paginación — traer todos los IDs que pasen el filtro
        List<Integer> ids = proyectoService.buscarIdsPorFiltros(
                filtro
        );

        // El límite se valida AQUÍ, después del filtro
        // Si el usuario no filtró nada y hay 5000 proyectos, falla aquí con mensaje claro
        validarTamano(ids);

        return ensamblar(ids);
    }

    // ════════════════════════════════════════════════════════════════════════
    // ENSAMBLAJE INTERNO
    // ════════════════════════════════════════════════════════════════════════

    private ProyectoReporteDTO ensamblarProyecto(
            RepProyectoBase p,
            Map<Integer, List<InvestigadorReporteDTO>>  investigadoresPorProyecto,
            Map<Integer, List<ObjetivoReporteDTO>>      objetivosPorProyecto,
            Map<Integer, List<InformeReporteDTO>>        informesPorProyecto,
            Map<Integer, List<RepPresupuestoBase>>       presupuestosPorProyecto,
            Map<Integer, List<GastoReporteDTO>>          gastosPorPresupuesto,
            Map<Integer, List<HorasAsignadasReporteDTO>> horasPorPresupuesto,
            Map<Integer, List<DocumentoDTO>> documentosPorProyecto
    ) {
        Integer idP = p.getIdProyecto();

        List<PresupuestoReporteDTO> presupuestosDTO = ensamblarPresupuestos(
                presupuestosPorProyecto.getOrDefault(idP, List.of()),
                gastosPorPresupuesto,
                horasPorPresupuesto
        );

        return proyectoService.obtenerProyectoReporteDTO(
                p,
                investigadoresPorProyecto.getOrDefault(idP, List.of()),
                List.of(),          // TODO: entidades — agregar RepEntidadService cuando esté listo
                presupuestosDTO,
                objetivosPorProyecto.getOrDefault(idP, List.of()),
                documentosPorProyecto.getOrDefault(idP, List.of()),
                informesPorProyecto.getOrDefault(idP, List.of())
        );
    }

    /**
     * Para cada presupuesto del proyecto, busca sus gastos y horas
     * en los Maps precargados (sin tocar la BD).
     *
     * La clave del join es idPresupuesto, NO idProyecto.
     * Esto es correcto: gastos y horas pertenecen al presupuesto, no al proyecto
     * directamente.
     */
    private List<PresupuestoReporteDTO> ensamblarPresupuestos(
            List<RepPresupuestoBase> presupuestos,
            Map<Integer, List<GastoReporteDTO>>          gastosPorPresupuesto,
            Map<Integer, List<HorasAsignadasReporteDTO>> horasPorPresupuesto
    ) {
        return presupuestos.stream()
                .map(pb -> presupuestoService.obtenerPresupuestoReporteDTO(
                        pb,
                        gastosPorPresupuesto.getOrDefault(pb.getIdPresupuesto(), List.of()),
                        horasPorPresupuesto.getOrDefault(pb.getIdPresupuesto(), List.of())
                ))
                .toList();
    }

    // ════════════════════════════════════════════════════════════════════════
    // VALIDACIÓN
    // ════════════════════════════════════════════════════════════════════════

    private void validarTamano(List<Integer> ids) {
        if (ids == null || ids.isEmpty()) {
            throw new IllegalArgumentException("La lista de IDs no puede estar vacía.");
        }
        if (ids.size() > MAX_PROYECTOS_POR_REPORTE) {
            throw new IllegalArgumentException(
                    "Se permiten máximo " + MAX_PROYECTOS_POR_REPORTE +
                    " proyectos por reporte. Recibidos: " + ids.size()
            );
        }
    }
}

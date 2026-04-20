package org.example.backend_cices_system.reportes.builder;

import org.example.backend_cices_system.reportes.dto.*;
import org.example.backend_cices_system.reportes.model.*;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static org.example.backend_cices_system.reportes.builder.ReportBuilderUtils.*;


/**
 * Jerarquía del documento generado:
 *
 * [H0] Resumen general del reporte
 *
 * Por cada proyecto:
 * [H1] CÓDIGO — Nombre
 *       Datos básicos, descripción, objetivo general
 *       Entidades vinculadas
 *       Objetivos → tabla de metas + indicadores por objetivo
 *
 *   [H2] Investigadores asignados
 *         Tabla: nombre, identificación, rol, actividad, fechas
 *
 *   [H2] Presupuestos de horas
 *         Resumen consolidado de todos los presupuestos de tipo HORAS
 *     [H3] Categoría [— Descripción]
 *           Detalle base + tabla de horas asignadas por investigador
 *
 *   [H2] Presupuestos financieros
 *         Resumen consolidado de todos los presupuestos de tipo FINANCIERO
 *     [H3] Categoría [— Descripción]
 *           Detalle base + tabla de gastos
 *
 *   [H2] Informes del proyecto
 *         Tabla: tipo, estado, fecha presentación
 *
 *   [H2] Documentos relacionados
 *         Tabla: nombre, directorio
 */
@Component
public class ProyectosReportBuilder implements ReportBuilder<List<ProyectoReporteDTO>> {

    private static final int H0 = 0;
    private static final int H1 = 1;
    private static final int H2 = 2;
    private static final int H3 = 3;

    // ═══════════════════════════════════════════════════════════════════════
    // PUNTO DE ENTRADA
    // ═══════════════════════════════════════════════════════════════════════

    @Override
    public ReportDocument build(List<ProyectoReporteDTO> proyectos) {
        List<ReportSection> sections = new ArrayList<>();
        sections.add(buildResumenGlobal(proyectos));
        proyectos.forEach(p -> sections.addAll(buildProyecto(p)));

        return new ReportDocument(
                "Reporte de Proyectos de Investigación",
                "CICES — Sistema de Gestión",
                LocalDate.now(),
                sections
        );
    }

    // ═══════════════════════════════════════════════════════════════════════
    // H0 — RESUMEN GLOBAL
    // ═══════════════════════════════════════════════════════════════════════

    private ReportSection buildResumenGlobal(List<ProyectoReporteDTO> proyectos) {
        long total       = proyectos.size();
        long activos     = contarPorEstado(proyectos, "ACTIVO");
        long finalizados = contarPorEstado(proyectos, "FINALIZADO");

        return section("Resumen General del Reporte", H0, List.of(
                new ReportTable(
                        List.of("Estado", "Cantidad"),
                        List.of(
                                row("Activos",     safe(activos)),
                                row("Finalizados", safe(finalizados)),
                                row("Otros",       safe(total - activos - finalizados)),
                                row("Total",       safe(total))
                        )
                )
        ));
    }

    // ═══════════════════════════════════════════════════════════════════════
    // H1 — PROYECTO
    // ═══════════════════════════════════════════════════════════════════════

    private List<ReportSection> buildProyecto(ProyectoReporteDTO p) {
        List<ReportSection> sections = new ArrayList<>();

        sections.add(buildProyectoBase(p));
        sections.add(buildInvestigadores(p));
        sections.addAll(buildPresupuestosHoras(p));
        sections.addAll(buildPresupuestosFinancieros(p));
        sections.add(buildInformes(p));
        sections.add(buildDocumentos(p));

        return sections;
    }

    // ── H1: datos base, entidades, objetivos ────────────────────────────────

    private ReportSection buildProyectoBase(ProyectoReporteDTO p) {
        List<ReportElement> elements = new ArrayList<>();

        elements.add(tabla2col("Datos del proyecto", List.of(
                row("Código",               safe(p.codigoProyecto())),
                row("Nombre",               safe(p.nombreProyecto())),
                row("Estado",               safe(p.estado())),
                row("Tipo",                 safe(p.tipoProyecto())),
                row("Línea de investigación", safe(p.lineaInvestigacion())),
                row("Fecha inicio",         fmt(p.fechaInicio())),
                row("Fecha fin",            fmt(p.fechaFinalizacion()))
        )));

        if (notEmpty(p.descripcionProyecto())) {
            elements.add(para("Descripción"));
            elements.add(para(p.descripcionProyecto()));
        }
        if (notEmpty(p.objetivoGeneral())) {
            elements.add(para("Objetivo general"));
            elements.add(para(p.objetivoGeneral()));
        }

        if (!p.entidades().isEmpty()) {
            elements.add(para("Entidades vinculadas"));
            elements.add(new ReportTable(
                    List.of("Entidad", "Tipo"),
                    p.entidades().stream()
                            .map(e -> row(safe(e.nombreEntidad()), safe(e.tipoEntidad())))
                            .collect(Collectors.toList())
            ));
        }

        if (!p.objetivos().isEmpty()) {
            elements.add(para("Objetivos específicos"));
            elements.addAll(buildObjetivos(p.objetivos()));
        }

        return section(safe(p.codigoProyecto()) + " — " + safe(p.nombreProyecto()), H1, elements);
    }

    // ── Objetivos → Metas → Indicadores ────────────────────────────────────

    private List<ReportElement> buildObjetivos(List<ObjetivoReporteDTO> objetivos) {
        List<ReportElement> elements = new ArrayList<>();

        for (int i = 0; i < objetivos.size(); i++) {
            ObjetivoReporteDTO obj = objetivos.get(i);
            elements.add(para((i + 1) + ". " + safe(obj.descripcion())));

            if (obj.metas() != null && !obj.metas().isEmpty()) {
                elements.add(new ReportTable(
                        List.of("Meta", "Tipo", "Cantidad", "Indicadores"),
                        obj.metas().stream()
                                .map(this::metaAFila)
                                .collect(Collectors.toList())
                ));
            }
        }

        return elements;
    }

    private List<String> metaAFila(MetaReporteDTO meta) {
        String indicadores = (meta.indicadores() == null || meta.indicadores().isEmpty())
                ? "—"
                : meta.indicadores().stream()
                  .map(IndicadorReporteDTO::descripcion)
                  .collect(Collectors.joining(" / "));

        return List.of(
                safe(meta.descripcion()),
                safe(meta.tipoMeta()),
                safe(meta.cantidad()),
                indicadores
        );
    }

    // ═══════════════════════════════════════════════════════════════════════
    // H2 — INVESTIGADORES
    // ═══════════════════════════════════════════════════════════════════════

    private ReportSection buildInvestigadores(ProyectoReporteDTO p) {
        if (p.investigadores().isEmpty()) {
            return section("Investigadores asignados", H2, List.of(para("Sin investigadores registrados.")));
        }

        return section("Investigadores asignados", H2, List.of(
                new ReportTable(
                        List.of("Nombre", "Identificación", "Rol", "Actividad", "Fecha inicio", "Fecha fin"),
                        p.investigadores().stream()
                                .map(inv -> List.of(
                                        safe(inv.nombreCompleto()),
                                        safe(inv.identificacion()),
                                        safe(inv.rolProyecto()),
                                        safe(inv.actividadProyecto()),
                                        fmt(inv.fechaInicio()),
                                        fmt(inv.fechaFin())
                                ))
                                .collect(Collectors.toList())
                )
        ));
    }

    // ═══════════════════════════════════════════════════════════════════════
    // H2 — PRESUPUESTOS DE HORAS  (H2 propio + H3 por cada presupuesto)
    // ═══════════════════════════════════════════════════════════════════════

    private List<ReportSection> buildPresupuestosHoras(ProyectoReporteDTO p) {
        List<PresupuestoReporteDTO> horas = filtrarPorTipo(p.presupuestos(), "HORAS");
        List<ReportSection> sections = new ArrayList<>();

        sections.add(buildResumenTipoPresupuesto("Presupuestos de horas", horas,
                List.of(
                        row("Total presupuestos",   safe(horas.size())),
                        row("Total horas asignadas", fmt(PresupuestoResumenCalc.totalAsignado(horas))),
                        row("Total horas usadas",    fmt(PresupuestoResumenCalc.totalUsado(horas))),
                        row("Horas disponibles",     fmt(PresupuestoResumenCalc.totalDisponible(horas)))
                )
        ));

        horas.forEach(pre -> sections.add(buildPresupuestoDetalle(pre,
                List.of(
                        row("Horas/mes",            fmt(pre.cantidadHorasMes())),
                        row("Meses",                safe(pre.cantidadMeses())),
                        row("Total horas asignadas", fmt(pre.presupuestoResumenReporteDTO().totalAsignado())),
                        row("Total horas usadas",    fmt(pre.presupuestoResumenReporteDTO().totalUsado())),
                        row("Horas disponibles",     fmt(pre.presupuestoResumenReporteDTO().disponible())),
                        row("Registros de horas",    safe(pre.presupuestoResumenReporteDTO().cantidad()))
                ),
                buildDetalleHorasAsignadas(pre)
        )));

        return sections;
    }

    private List<ReportElement> buildDetalleHorasAsignadas(PresupuestoReporteDTO pre) {
        if (pre.horasAsignadas() == null || pre.horasAsignadas().isEmpty()) {
            return List.of(para("Sin horas asignadas registradas."));
        }
        return List.of(
                para("Horas asignadas por investigador"),
                new ReportTable(
                        List.of("Investigador", "Modalidad", "Horas/mes", "Meses", "Total horas"),
                        pre.horasAsignadas().stream()
                                .map(h -> List.of(
                                        safe(h.investigador()),
                                        safe(h.modalidad()),
                                        fmt(h.horasMes()),
                                        safe(h.meses()),
                                        fmt(h.totalHorasAsignadas())
                                ))
                                .collect(Collectors.toList())
                )
        );
    }

    // ═══════════════════════════════════════════════════════════════════════
    // H2 — PRESUPUESTOS FINANCIEROS  (H2 propio + H3 por cada presupuesto)
    // ═══════════════════════════════════════════════════════════════════════

    private List<ReportSection> buildPresupuestosFinancieros(ProyectoReporteDTO p) {
        List<PresupuestoReporteDTO> financieros = filtrarPorTipo(p.presupuestos(), "FINANCIERO");
        List<ReportSection> sections = new ArrayList<>();

        sections.add(buildResumenTipoPresupuesto("Presupuestos financieros", financieros,
                List.of(
                        row("Total presupuestos",   safe(financieros.size())),
                        row("Monto total asignado", fmt(PresupuestoResumenCalc.totalAsignado(financieros))),
                        row("Total gastado",        fmt(PresupuestoResumenCalc.totalUsado(financieros))),
                        row("Disponible",           fmt(PresupuestoResumenCalc.totalDisponible(financieros))),
                        row("Cantidad de gastos",   safe(PresupuestoResumenCalc.cantidadRegistros(financieros)))
                )
        ));

        financieros.forEach(pre -> sections.add(buildPresupuestoDetalle(pre,
                List.of(
                        row("Monto asignado",    fmt(pre.montoAsignado())),
                        row("Total gastado",     fmt(pre.presupuestoResumenReporteDTO().totalUsado())),
                        row("Monto disponible",  fmt(pre.presupuestoResumenReporteDTO().disponible())),
                        row("Cantidad de gastos",safe(pre.presupuestoResumenReporteDTO().cantidad()))
                ),
                buildDetalleGastos(pre)
        )));

        return sections;
    }

    private List<ReportElement> buildDetalleGastos(PresupuestoReporteDTO pre) {
        if (pre.gastos() == null || pre.gastos().isEmpty()) {
            return List.of(para("Sin gastos registrados."));
        }
        return List.of(
                para("Detalle de gastos"),
                new ReportTable(
                        List.of("Descripción", "Monto", "Fecha"),
                        pre.gastos().stream()
                                .map(g -> List.of(
                                        safe(g.descripcion()),
                                        fmt(g.monto()),
                                        fmt(g.fechaGasto())
                                ))
                                .collect(Collectors.toList())
                )
        );
    }

    // ═══════════════════════════════════════════════════════════════════════
    // PLANTILLAS COMPARTIDAS — eliminan duplicación entre HORAS y FINANCIERO
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * H2 de resumen para un tipo de presupuesto.
     * Si la lista está vacía muestra "Sin registros" en lugar de la tabla.
     *
     * @param titulo    heading del H2 ("Presupuestos de horas" / "Presupuestos financieros")
     * @param lista     presupuestos del tipo correspondiente
     * @param filasResumen filas ya calculadas con los totales del tipo
     */
    private ReportSection buildResumenTipoPresupuesto(
            String titulo,
            List<PresupuestoReporteDTO> lista,
            List<List<String>> filasResumen
    ) {
        if (lista.isEmpty()) {
            return section(titulo, H2, List.of(para("Sin registros.")));
        }
        return section(titulo, H2, List.of(tabla2col("Resumen", filasResumen)));
    }

    /**
     * H3 de detalle para un presupuesto individual.
     * Comparte estructura: datos base comunes + filas específicas del tipo + detalle (gastos u horas).
     *
     * @param pre           presupuesto a renderizar
     * @param filasEspecificas filas de la tabla de detalle propias del tipo (horas o financiero)
     * @param elementosDetalle elementos del bloque de detalle (tabla de gastos o tabla de horas)
     */
    private ReportSection buildPresupuestoDetalle(
            PresupuestoReporteDTO pre,
            List<List<String>> filasEspecificas,
            List<ReportElement> elementosDetalle
    ) {
        List<ReportElement> elements = new ArrayList<>();

        // Campos comunes a ambos tipos de presupuesto
        List<List<String>> filasBase = new ArrayList<>(List.of(
                row("Categoría",             safe(pre.categoria())),
                row("Descripción",           safe(pre.descripcion())),
                row("Fuente financiamiento", safe(pre.fuenteFinanciamiento())),
                row("Fecha asignación",      fmt(pre.fechaAsignacion()))
        ));
        filasBase.addAll(filasEspecificas); // campos propios del tipo (horas vs financiero)

        elements.add(tabla2col("Detalle del presupuesto", filasBase));
        elements.addAll(elementosDetalle);

        return section(headingPresupuesto(pre), H3, elements);
    }

    /** "Categoría — Descripción" si hay descripción, solo "Categoría" si no. */
    private String headingPresupuesto(PresupuestoReporteDTO pre) {
        return notEmpty(pre.descripcion())
                ? safe(pre.categoria()) + " — " + pre.descripcion()
                : safe(pre.categoria());
    }

    // ═══════════════════════════════════════════════════════════════════════
    // H2 — INFORMES
    // ═══════════════════════════════════════════════════════════════════════

    private ReportSection buildInformes(ProyectoReporteDTO p) {
        if (p.informes().isEmpty()) {
            return section("Informes del proyecto", H2, List.of(para("Sin informes registrados.")));
        }
        return section("Informes del proyecto", H2, List.of(
                new ReportTable(
                        List.of("Tipo", "Estado", "Fecha presentación"),
                        p.informes().stream()
                                .map(i -> List.of(
                                        safe(i.tipoInforme()),
                                        safe(i.estado()),
                                        fmt(i.fechaPresentacion())
                                ))
                                .collect(Collectors.toList())
                )
        ));
    }

    // ═══════════════════════════════════════════════════════════════════════
    // H2 — DOCUMENTOS
    // ═══════════════════════════════════════════════════════════════════════

    private ReportSection buildDocumentos(ProyectoReporteDTO p) {
        if (p.documentos().isEmpty()) {
            return section("Documentos relacionados", H2, List.of(para("Sin documentos registrados.")));
        }
        return section("Documentos relacionados", H2, List.of(
                new ReportTable(
                        List.of("Nombre del documento", "Directorio"),
                        p.documentos().stream()
                                .map(d -> List.of(
                                        safe(d.nombreDocumento()),
                                        safe(d.directorio())
                                ))
                                .collect(Collectors.toList())
                )
        ));
    }

    // ═══════════════════════════════════════════════════════════════════════
    // HELPERS INTERNOS
    // ═══════════════════════════════════════════════════════════════════════

    private List<PresupuestoReporteDTO> filtrarPorTipo(List<PresupuestoReporteDTO> presupuestos, String tipo) {
        if (presupuestos == null) return List.of();
        return presupuestos.stream()
                .filter(p -> tipo.equalsIgnoreCase(p.tipoPresupuesto()))
                .collect(Collectors.toList());
    }

    private long contarPorEstado(List<ProyectoReporteDTO> proyectos, String estado) {
        return proyectos.stream()
                .filter(p -> estado.equalsIgnoreCase(p.estado()))
                .count();
    }
}

package org.example.backend_cices_system.export.builder;

import org.example.backend_cices_system.export.dto.*;
import org.example.backend_cices_system.export.model.*;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import static org.example.backend_cices_system.export.builder.ReportBuilderUtils.*;

@Component
public class PresupuestosReportBuilder implements ReportBuilder<List<ReportePresupuestosExportDTO>> {

    private static final int H0 = 0;
    private static final int H1 = 1;
    private static final int H2 = 2;
    private static final int H3 = 3;
    private static final int H4 = 4;

    @Override
    public ReportDocument build(List<ReportePresupuestosExportDTO> datos) {
        List<ReportSection> sections = new ArrayList<>();
        sections.add(buildResumenGlobal(datos));
        datos.forEach(d -> sections.addAll(buildProyecto(d)));

        return new ReportDocument(
                "Reporte de Presupuestos",
                "CICES — Sistema de Gestión",
                LocalDate.now(),
                sections
        );
    }

    // ── H0 Resumen global ──────────────────────────────────────────────────

    private ReportSection buildResumenGlobal(List<ReportePresupuestosExportDTO> datos) {
        long totalFinancieros = datos.stream()
                .flatMap(d -> d.presupuestos().stream())
                .filter(p -> "FINANCIERO".equalsIgnoreCase(p.base().tipoPresupuesto()))
                .count();
        long totalHoras = datos.stream()
                .flatMap(d -> d.presupuestos().stream())
                .filter(p -> "HORAS".equalsIgnoreCase(p.base().tipoPresupuesto()))
                .count();

        return section("Resumen General del Reporte", H0, List.of(
                new ReportTable(
                        List.of("Indicador", "Cantidad"),
                        List.of(
                                row("Proyectos incluidos", safe(datos.size())),
                                row("Presupuestos financieros", safe(totalFinancieros)),
                                row("Presupuestos de horas", safe(totalHoras))
                        )
                )
        ));
    }

    // ── H1 Proyecto ─────────────────────────────────────────────────────────

    private List<ReportSection> buildProyecto(ReportePresupuestosExportDTO dto) {
        List<ReportSection> sections = new ArrayList<>();

        // H1: código del proyecto
        List<ReportElement> intro = new ArrayList<>();
        intro.add(para("Nombre: " + safe(dto.proyecto().nombreProyecto())));
        intro.add(para("Período: " + fmt(dto.proyecto().fechaInicio())
                + " — " + fmt(dto.proyecto().fechaFinalizacion())));
        sections.add(section(safe(dto.proyecto().codigoProyecto()), H1, intro));

        // H2: presupuestos financieros
        List<PresupuestoConBitacorasReporteDTO> financieros = filtrarPorTipo(dto.presupuestos(), "FINANCIERO");
        // H2: presupuestos financieros
        if (!financieros.isEmpty()) {
            sections.add(section("Presupuesto Financiero", H2,
                    List.of(para("Detalle de presupuestos financieros del proyecto."))));

            sections.add(buildResumenProyecto(financieros));

            financieros.forEach(p -> sections.addAll(buildDetalle(p)));
        }

        // H2: presupuestos de horas
        List<PresupuestoConBitacorasReporteDTO> horas = filtrarPorTipo(dto.presupuestos(), "HORAS");
        if (!horas.isEmpty()) {
            sections.add(section("Presupuesto Horas", H2,
                    List.of(para("Detalle de presupuestos de horas del proyecto."))));

            sections.add(buildResumenProyecto(horas));

            horas.forEach(p -> sections.addAll(buildDetalle(p)));
        }

        if (financieros.isEmpty() && horas.isEmpty()) {
            sections.add(section("Presupuestos", H2,
                    List.of(para("Sin presupuestos registrados."))));
        }

        return sections;
    }

    private ReportSection buildResumenProyecto(List<PresupuestoConBitacorasReporteDTO> lista) {

        double totalAsignado = lista.stream()
                .map(p -> p.base().resumen().totalAsignado())
                .filter(Objects::nonNull)
                .mapToDouble(Number::doubleValue)
                .sum();

        double totalUsado = lista.stream()
                .map(p -> p.base().resumen().totalUsado())
                .filter(Objects::nonNull)
                .mapToDouble(Number::doubleValue)
                .sum();

        double totalDisponible = lista.stream()
                .map(p -> p.base().resumen().disponible())
                .filter(Objects::nonNull)
                .mapToDouble(Number::doubleValue)
                .sum();

        return section("Resumen del proyecto", H3, List.of(
                new ReportTable(
                        List.of("Indicador", "Valor"),
                        List.of(
                                row("Total asignado", fmt(totalAsignado)),
                                row("Total usado", fmt(totalUsado)),
                                row("Total disponible", fmt(totalDisponible))
                        )
                )
        ));
    }

    // ── H3 Detalle de un presupuesto (datos actuales + cambios) ─────────────

    private List<ReportSection> buildDetalle(PresupuestoConBitacorasReporteDTO dto) {
        List<ReportSection> sections = new ArrayList<>();
        PresupuestoReporteDTO base = dto.base();
        boolean esHoras = "HORAS".equalsIgnoreCase(base.tipoPresupuesto());

        String heading = notEmpty(base.descripcion())
                ? safe(base.categoria()) + " — " + base.descripcion()
                : safe(base.categoria());

        // Tabla estado actual (horizontal para que sea más ancha)
        List<ReportElement> elementos = new ArrayList<>();

        if (esHoras) {
            elementos.add(new ReportTable(
                    List.of("Categoría", "Horas/mes", "Meses",
                            "Horas asignadas", "Horas usadas", "Horas disponibles"),
                    List.of(List.of(
                            safe(base.categoria()),
                            fmt(base.cantidadHorasMes()),
                            safe(base.cantidadMeses()),
                            fmt(base.resumen().totalAsignado()),
                            fmt(base.resumen().totalUsado()),
                            fmt(base.resumen().disponible())
                    ))
            ));

            // Tabla de horas asignadas
            if (base.horasAsignadas() != null && !base.horasAsignadas().isEmpty()) {
                elementos.add(paraBold("Horas asignadas por investigador"));
                elementos.add(new ReportTable(
                        List.of("Investigador", "Modalidad", "Horas/mes", "Meses", "Total horas"),
                        base.horasAsignadas().stream().map(h -> List.of(
                                safe(h.investigador()), safe(h.modalidad()),
                                fmt(h.horasMes()), safe(h.meses()), fmt(h.totalHorasAsignadas())
                        )).collect(Collectors.toList())
                ));
            }
        } else {
            elementos.add(new ReportTable(
                    List.of("Categoría", "Fuente", "Fecha asignación",
                            "Monto asignado", "Total gastado", "Disponible"),
                    List.of(List.of(
                            safe(base.categoria()),
                            safe(base.fuenteFinanciamiento()),
                            fmt(base.fechaAsignacion()),
                            fmt(base.montoAsignado()),
                            fmt(base.resumen().totalUsado()),
                            fmt(base.resumen().disponible())
                    ))
            ));

            // Tabla de gastos
            if (base.gastos() != null && !base.gastos().isEmpty()) {
                elementos.add(paraBold("Detalle de gastos"));
                elementos.addAll(buildGastosConCambios(base.gastos(), dto.cambiosGasto()));
            }
        }

        sections.add(section(heading, H3, elementos));

        // H4: Cambios del presupuesto
        sections.add(buildCambiosPresupuesto(
                dto.cambiosPresupuesto(),
                esHoras,
                base
        ));

        return sections;
    }

    private ReportSection buildCambiosPresupuesto(
            List<BitacoraPresupuestoReporteDTO> cambios,
            boolean esHoras,
            PresupuestoReporteDTO base
    ) {

        if (cambios == null || cambios.isEmpty()) {
            return section("Cambios del presupuesto", H4,
                    List.of(para("Sin cambios registrados.")));
        }

        List<String> headers = esHoras
                ? List.of(
                "Fecha",
                "Acción",
                "Usuario",
                "Horas/mes anterior",
                "Meses anterior",
                "Cambio"
        )
                : List.of(
                "Fecha",
                "Acción",
                "Usuario",
                "Monto anterior",
                "Cambio"
        );

        List<List<String>> filas = new ArrayList<>();

        for (int i = 0; i < cambios.size(); i++) {

            BitacoraPresupuestoReporteDTO actual = cambios.get(i);

            BitacoraPresupuestoReporteDTO anterior =
                    i > 0 ? cambios.get(i - 1) : null;

            String tendencia;

            if (esHoras) {

                BigDecimal nuevoHoras = anterior != null
                        ? parseBigDecimal(anterior.horasMesAnterior())
                        : base.cantidadHorasMes();

                BigDecimal horasAnterior =
                        parseBigDecimal(actual.horasMesAnterior());

                tendencia = calcularTendencia(
                        horasAnterior,
                        nuevoHoras
                );
                filas.add(List.of(
                        fmt(actual.fecha()),
                        safe(actual.accion()),
                        safe(actual.usuario()),
                        safe(actual.horasMesAnterior()),
                        safe(actual.mesesAnterior()),
                        tendencia
                ));

            } else {

                BigDecimal nuevoMonto = anterior != null
                        ? parseBigDecimal(anterior.montoAnterior())
                        : base.montoAsignado();

                BigDecimal montoAnterior =
                        parseBigDecimal(actual.montoAnterior());

                tendencia = calcularTendencia(
                        montoAnterior,
                        nuevoMonto
                );

                filas.add(List.of(
                        fmt(actual.fecha()),
                        safe(actual.accion()),
                        safe(actual.usuario()),
                        safe(actual.montoAnterior()),
                        tendencia
                ));
            }
        }

        return section(
                "Cambios del presupuesto",
                H4,
                List.of(new ReportTable(headers, filas))
        );
    }

    private List<ReportElement> buildGastosConCambios(
            List<GastoReporteDTO> gastos,
            List<BitacoraGastoReporteDTO> cambios
    ) {
        List<ReportElement> elementos = new ArrayList<>();

        Map<Integer, List<BitacoraGastoReporteDTO>> cambiosPorGasto =
                cambios == null
                        ? Map.of()
                        : cambios.stream()
                          .collect(Collectors.groupingBy(BitacoraGastoReporteDTO::idGasto));

        for (GastoReporteDTO g : gastos) {

            // 🔹 Tabla del gasto actual
            elementos.add(new ReportTable(
                    List.of("Descripción", "Monto", "Fecha gasto"),
                    List.of(List.of(
                            safe(g.descripcion()),
                            fmt(g.monto()),
                            fmt(g.fechaGasto())
                    ))
            ));

            // 🔹 Cambios del gasto
            List<BitacoraGastoReporteDTO> listaCambios =
                    cambiosPorGasto.get(g.id());

            if (listaCambios != null && !listaCambios.isEmpty()) {

                elementos.add(paraBold("Cambios"));

                elementos.addAll(
                        listaCambios.stream()
                                .map(c -> para( "• " +
                                        safe(c.accion()) + " - " +
                                                safe(c.usuario()) + " - " +
                                                safe(c.descripcionAnterior()) + " - " +
                                                fmt(c.montoAnterior()) + " - " +
                                                fmt(c.fechaGastoAnterior())
                                ))
                                .toList()
                );
            }
        }

        return elementos;
    }

    private List<PresupuestoConBitacorasReporteDTO> filtrarPorTipo(
            List<PresupuestoConBitacorasReporteDTO> lista, String tipo) {
        if (lista == null) return List.of();
        return lista.stream()
                .filter(p -> tipo.equalsIgnoreCase(p.base().tipoPresupuesto()))
                .toList();
    }

    private String calcularTendencia(
            BigDecimal anterior,
            BigDecimal nuevo
    ) {

        if (anterior == null || nuevo == null) {
            return "→ Sin cambio";
        }

        int comparacion = nuevo.compareTo(anterior);

        if (comparacion > 0) {
            return "↑ Aumento";
        }

        if (comparacion < 0) {
            return "↓ Disminución";
        }

        return "→ Sin cambio";
    }

    private BigDecimal parseBigDecimal(String value) {

        try {

            return value == null || value.isBlank()
                    ? null
                    : new BigDecimal(value);

        } catch (Exception e) {
            return null;
        }
    }
}
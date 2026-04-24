package org.example.backend_cices_system.export.builder;

import org.example.backend_cices_system.export.dto.PresupuestoReporteDTO;
import org.example.backend_cices_system.export.dto.PresupuestoResumenReporteDTO;

import java.math.BigDecimal;
import java.util.List;

import static org.example.backend_cices_system.export.builder.ReportBuilderUtils.nvl;

/**
 * Cálculos de resumen sobre listas de presupuestos.
 *
 * Separado del builder para que la lógica de negocio (sumar, agregar)
 * sea testeable independientemente sin construir un ReportDocument completo.
 */
public final class PresupuestoResumenCalc {

    private PresupuestoResumenCalc() {}

    // ═══════════════════════════════════════════════════════════════════════
    // TOTALES POR CAMPO DEL RESUMEN
    // ═══════════════════════════════════════════════════════════════════════

    public static BigDecimal totalAsignado(List<PresupuestoReporteDTO> presupuestos) {
        return presupuestos.stream()
                .map(p -> nvl(p.resumen().totalAsignado()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public static BigDecimal totalUsado(List<PresupuestoReporteDTO> presupuestos) {
        return presupuestos.stream()
                .map(p -> nvl(p.resumen().totalUsado()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public static BigDecimal totalDisponible(List<PresupuestoReporteDTO> presupuestos) {
        return presupuestos.stream()
                .map(p -> nvl(p.resumen().disponible()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public static long cantidadRegistros(List<PresupuestoReporteDTO> presupuestos) {
        return presupuestos.stream()
                .mapToLong(p -> nvl(p.resumen().cantidad()))
                .sum();
    }

    // ═══════════════════════════════════════════════════════════════════════
    // CONSOLIDADO COMPLETO (para el H2 de resumen)
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Agrega todos los campos de resumen de una lista de presupuestos del mismo tipo.
     * Útil para mostrar la fila de totales en el H2.
     */
    public static PresupuestoResumenReporteDTO consolidar(List<PresupuestoReporteDTO> presupuestos) {
        return new PresupuestoResumenReporteDTO(
                totalAsignado(presupuestos),
                totalUsado(presupuestos),
                totalDisponible(presupuestos),
                cantidadRegistros(presupuestos)
        );
    }
}

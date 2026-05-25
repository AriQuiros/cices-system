package org.example.backend_cices_system.utils;

import org.example.backend_cices_system.model.export.ReportElement;
import org.example.backend_cices_system.model.export.ReportParagraph;
import org.example.backend_cices_system.model.export.ReportSection;
import org.example.backend_cices_system.model.export.ReportTable;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * Utilitario estático para builders de reportes.
 *
 * Agrupa:
 *  - Constructores de elementos del modelo (section, para, tabla2col, row)
 *  - Formateo nulo-seguro de tipos comunes (String, Number, BigDecimal, LocalDate, etc.)
 *
 * No tiene estado ni dependencias de Spring. Se usa mediante import static.
 */
public final class ReportBuilderUtils {

    private ReportBuilderUtils() {}

    // ═══════════════════════════════════════════════════════════════════════
    // CONSTRUCTORES DE ELEMENTOS
    // ═══════════════════════════════════════════════════════════════════════

    public static ReportSection section(String heading, int level, List<ReportElement> elements) {
        return new ReportSection(heading, level, elements);
    }

    public static ReportParagraph para(String text) {
        return new ReportParagraph(text, false);
    }

    public static ReportParagraph paraBold(String text) {
        return new ReportParagraph(text, true);
    }

    /**
     * Tabla de 2 columnas tipo "campo / valor".
     * El título queda embebido como primera cabecera para que el renderer
     * lo trate como encabezado descriptivo de la tabla.
     */
    public static ReportTable tabla2col(String titulo, List<List<String>> rows) {
        return new ReportTable(List.of(titulo, ""), rows);
    }

    /** Fila de dos celdas para tabla2col. */
    public static List<String> row(String campo, String valor) {
        return List.of(campo, valor);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // FORMATEO NULO-SEGURO
    // ═══════════════════════════════════════════════════════════════════════

    public static String safe(String s)      { return s != null ? s : "—"; }
    public static String safe(Number n)      { return n != null ? String.valueOf(n) : "—"; }

    private static final DateTimeFormatter CR_FORMAT =
            DateTimeFormatter.ofPattern("dd/MM/yyyy");

    public static String fmt(LocalDate d) {
        return d != null ? d.format(CR_FORMAT) : "—";
    }

    public static String fmt(BigDecimal bd)  { return bd != null ? bd.toPlainString() : "—"; }
    public static String fmt(Double d)       { return d != null ? String.valueOf(d) : "—"; }
    public static String fmt(Object o)       { return o != null ? o.toString() : "—"; }
    public static boolean notEmpty(String s) { return s != null && !s.isBlank(); }

    /** Devuelve ZERO si el valor es null. Para sumas seguras sobre BigDecimal. */
    public static BigDecimal nvl(BigDecimal bd) { return bd != null ? bd : BigDecimal.ZERO; }

    /** Devuelve 0 si el valor es null. Para sumas seguras sobre Long. */
    public static long nvl(Long l) { return l != null ? l : 0L; }
}

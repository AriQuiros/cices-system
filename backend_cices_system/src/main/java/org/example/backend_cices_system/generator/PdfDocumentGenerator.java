package org.example.backend_cices_system.generator;

import org.apache.pdfbox.pdmodel.*;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.example.backend_cices_system.model.export.*;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Component
public class PdfDocumentGenerator implements DocumentGenerator {

    private static final float MARGIN        = 40f;
    private static final float PAGE_WIDTH    = PDRectangle.LETTER.getWidth();   // 612
    private static final float PAGE_HEIGHT   = PDRectangle.LETTER.getHeight();  // 792
    private static final float HEADER_HEIGHT = 80f;   // espacio reservado para el encabezado
    private static final float START_Y       = PAGE_HEIGHT - MARGIN - HEADER_HEIGHT;
    private static final float BOTTOM_MARGIN = 60f;

    private static final PDType1Font FONT =
            new PDType1Font(Standard14Fonts.FontName.HELVETICA);
    private static final PDType1Font FONT_BOLD =
            new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD);

    private static final DateTimeFormatter DATE_FMT =
            DateTimeFormatter.ofPattern("dd/MM/yyyy");

    private static class PageState {
        PDPage page;
        float y;
        PageState(PDPage page, float y) { this.page = page; this.y = y; }
    }

    @Override
    public DocumentFormat getFormat() { return DocumentFormat.PDF; }

    @Override
    public byte[] generate(ReportDocument doc) {
        try (PDDocument pdf = new PDDocument()) {

            PDPage firstPage = new PDPage(PDRectangle.LETTER);
            pdf.addPage(firstPage);

            // Dibujar encabezado en la primera página
            drawHeader(pdf, firstPage, doc);

            PageState state = new PageState(firstPage, START_Y);

            for (ReportSection section : doc.sections()) {
                state = ensureSpace(pdf, state, 30, doc);
                state = writeText(pdf, state, safe(section.heading()), 12, true);
                state.y -= 4;

                for (ReportElement element : section.elements()) {
                    if (element instanceof ReportParagraph(String text, boolean bold)) {
                        state = ensureSpace(pdf, state, 16, doc);
                        state = writeText(pdf, state, safe(text), 10, bold);
                    }
                    if (element instanceof ReportTable t) {
                        state = writeTable(pdf, state, t, doc);
                        state.y -= 10;
                    }
                }
                state.y -= 8;
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            pdf.save(out);
            return out.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Error generando PDF", e);
        }
    }

    // ── ENCABEZADO ──────────────────────────────────────────────────────────
    private void drawHeader(PDDocument doc, PDPage page, ReportDocument reportDoc) {
        try (PDPageContentStream content = new PDPageContentStream(
                doc, page, PDPageContentStream.AppendMode.APPEND, true)) {

            float headerTop = PAGE_HEIGHT - MARGIN;
            float logoSize  = 70f;

            // Logo UCR (izquierda)
            try (InputStream imgStream = getClass().getClassLoader()
                    .getResourceAsStream("static/images/logoUCR.png")) {
                if (imgStream != null) {
                    PDImageXObject img = PDImageXObject.createFromByteArray(
                            doc, imgStream.readAllBytes(), "logoUCR");
                    content.drawImage(img, MARGIN, headerTop - logoSize, logoSize, logoSize);
                }
            } catch (Exception ignored) {}

            // Logo CICES (derecha)
            try (InputStream imgStream = getClass().getClassLoader()
                    .getResourceAsStream("static/images/logoCICES.png")) {
                if (imgStream != null) {
                    PDImageXObject img = PDImageXObject.createFromByteArray(
                            doc, imgStream.readAllBytes(), "logoCICES");
                    content.drawImage(img,
                            PAGE_WIDTH - MARGIN - logoSize,
                            headerTop - logoSize,
                            logoSize, logoSize);
                }
            } catch (Exception ignored) {}

            // Nombre del sistema (centrado)
            String sistema = safe(reportDoc.systemName());
            float sistemaWidth = FONT_BOLD.getStringWidth(sistema) / 1000 * 11;
            content.beginText();
            content.setFont(FONT_BOLD, 11);
            content.newLineAtOffset((PAGE_WIDTH - sistemaWidth) / 2, headerTop - 14);
            content.showText(sistema);
            content.endText();

            // Título del reporte (centrado)
            String titulo = safe(reportDoc.title());
            float tituloWidth = FONT.getStringWidth(titulo) / 1000 * 10;
            content.beginText();
            content.setFont(FONT, 10);
            content.newLineAtOffset((PAGE_WIDTH - tituloWidth) / 2, headerTop - 28);
            content.showText(titulo);
            content.endText();

            // Fecha (centrado)
            String fecha = reportDoc.date() != null
                    ? "Fecha: " + reportDoc.date().format(DATE_FMT)
                    : "";
            float fechaWidth = FONT.getStringWidth(fecha) / 1000 * 9;
            content.beginText();
            content.setFont(FONT, 9);
            content.newLineAtOffset((PAGE_WIDTH - fechaWidth) / 2, headerTop - 42);
            content.showText(fecha);
            content.endText();

            // Línea separadora
            content.setLineWidth(0.5f);
            content.moveTo(MARGIN, headerTop - HEADER_HEIGHT + 10);
            content.lineTo(PAGE_WIDTH - MARGIN, headerTop - HEADER_HEIGHT + 10);
            content.stroke();

        } catch (Exception e) {
            throw new RuntimeException("Error dibujando encabezado PDF", e);
        }
    }

    // ── ESPACIO / NUEVA PÁGINA ──────────────────────────────────────────────
    private PageState ensureSpace(PDDocument doc, PageState state,
                                  float needed, ReportDocument reportDoc) {
        if (state.y - needed < BOTTOM_MARGIN) {
            PDPage newPage = new PDPage(PDRectangle.LETTER);
            doc.addPage(newPage);
            drawHeader(doc, newPage, reportDoc);
            return new PageState(newPage, START_Y);
        }
        return state;
    }

    // ── TEXTO ──────────────────────────────────────────────────────────────
    private PageState writeText(PDDocument doc, PageState state,
                                String text, int size, boolean bold) {
        try (PDPageContentStream content = new PDPageContentStream(
                doc, state.page, PDPageContentStream.AppendMode.APPEND, true)) {
            content.beginText();
            content.setFont(bold ? FONT_BOLD : FONT, size);
            content.newLineAtOffset(MARGIN, state.y);
            content.showText(safe(text));
            content.endText();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        state.y -= (size + 4);
        return state;
    }

    // ── TABLA ─────────────────────────────────────────────────────────────
    private PageState writeTable(PDDocument doc, PageState state,
                                 ReportTable table, ReportDocument reportDoc) {
        float tableWidth = PAGE_WIDTH - (MARGIN * 2);
        float startX     = MARGIN;

        boolean hasHeader = table.headers() != null && !table.headers().isEmpty();
        List<String> headers = hasHeader ? table.headers() : null;

        int cols = hasHeader
                ? headers.size()
                : (table.rows() != null && !table.rows().isEmpty()
                   ? table.rows().getFirst().size() : 0);

        if (cols == 0) return state;

        float colWidth = tableWidth / cols;

        try {
            if (hasHeader) {
                state = ensureSpace(doc, state, 24, reportDoc);
                try (PDPageContentStream content = new PDPageContentStream(
                        doc, state.page, PDPageContentStream.AppendMode.APPEND, true)) {
                    float h = drawRow(content, headers, startX, state.y, colWidth, true);
                    state.y -= h;
                }
            }

            if (table.rows() != null) {
                for (var row : table.rows()) {
                    state = ensureSpace(doc, state, 20, reportDoc);

                    // Si nueva página con headers: repetir encabezado
                    if (hasHeader && state.y >= START_Y - 2) {
                        try (PDPageContentStream content = new PDPageContentStream(
                                doc, state.page, PDPageContentStream.AppendMode.APPEND, true)) {
                            float h = drawRow(content, headers, startX, state.y, colWidth, true);
                            state.y -= h;
                        }
                    }

                    try (PDPageContentStream content = new PDPageContentStream(
                            doc, state.page, PDPageContentStream.AppendMode.APPEND, true)) {
                        float h = drawRow(content, row, startX, state.y, colWidth, false);
                        state.y -= h;
                    }
                }
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        return state;
    }

    private float drawRow(PDPageContentStream content, List<String> row,
                          float startX, float y, float colWidth, boolean bold) throws Exception {
        PDType1Font font = bold ? FONT_BOLD : FONT;
        int fontSize = 9;
        float padding = 3;

        List<List<String>> wrapped = new java.util.ArrayList<>();
        int maxLines = 1;
        for (String cell : row) {
            List<String> lines = wrapText(cell, colWidth - padding * 2, font, fontSize);
            wrapped.add(lines);
            maxLines = Math.max(maxLines, lines.size());
        }

        float rowHeight = (fontSize + 3) * maxLines + padding * 2;
        float x = startX;

        for (List<String> cellLines : wrapped) {
            content.addRect(x, y - rowHeight, colWidth, rowHeight);
            content.stroke();
            float textY = y - fontSize - padding;
            for (String line : cellLines) {
                content.beginText();
                content.setFont(font, fontSize);
                content.newLineAtOffset(x + padding, textY);
                content.showText(line);
                content.endText();
                textY -= (fontSize + 3);
            }
            x += colWidth;
        }
        return rowHeight;
    }

    private List<String> wrapText(String text, float maxWidth,
                                  PDType1Font font, int fontSize) throws Exception {
        List<String> lines = new java.util.ArrayList<>();
        String[] words = safe(text).split(" ");
        StringBuilder current = new StringBuilder();

        for (String word : words) {
            String test = current.isEmpty() ? word : current + " " + word;
            if (font.getStringWidth(test) / 1000 * fontSize > maxWidth) {
                if (!current.isEmpty()) lines.add(current.toString());
                current = new StringBuilder(word);
            } else {
                current = new StringBuilder(test);
            }
        }
        if (!current.isEmpty()) lines.add(current.toString());
        return lines.isEmpty() ? List.of("") : lines;
    }

    private String safe(String s) {
        if (s == null) return "";
        return s.replace("\n", " ").replace("\r", "");
    }
}
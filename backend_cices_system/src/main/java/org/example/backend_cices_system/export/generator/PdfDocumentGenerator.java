package org.example.backend_cices_system.export.generator;

import org.apache.pdfbox.pdmodel.*;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.example.backend_cices_system.export.model.*;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.util.List;

@Component
public class PdfDocumentGenerator implements DocumentGenerator {

    private static final float MARGIN = 30;
    private static final float START_Y = 750;
    private static final float BOTTOM_MARGIN = 50;

    private static final PDType1Font FONT =
            new PDType1Font(Standard14Fonts.FontName.HELVETICA);

    private static final PDType1Font FONT_BOLD =
            new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD);

    private static class PageState {
        PDPage page;
        float y;

        PageState(PDPage page, float y) {
            this.page = page;
            this.y = y;
        }
    }

    private PageState ensureSpace(PDDocument doc, PageState state, float neededHeight) {
        if (state.y - neededHeight < BOTTOM_MARGIN) {
            PDPage newPage = new PDPage();
            doc.addPage(newPage);
            return new PageState(newPage, START_Y);
        }
        return state;
    }

    @Override
    public DocumentFormat getFormat() {
        return DocumentFormat.PDF;
    }

    @Override
    public byte[] generate(ReportDocument doc) {
        try (PDDocument pdf = new PDDocument()) {

            PDPage firstPage = new PDPage();
            pdf.addPage(firstPage);

            PageState state = new PageState(firstPage, START_Y);

            for (ReportSection section : doc.sections()) {

                state = writeText(pdf, state, safe(section.heading()), 18, true);

                for (ReportElement element : section.elements()) {

                    if (element instanceof ReportParagraph(String text)) {
                        state = writeText(pdf, state, safe(text), 11, false);
                    }

                    if (element instanceof ReportTable t) {
                        state = writeTable(pdf, state, t);
                        state.y -= 25;
                    }
                }
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            pdf.save(out);
            return out.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Error generando PDF", e);
        }
    }

    private PageState writeText(PDDocument doc, PageState state,
                                String text, int size, boolean bold) {

        state = ensureSpace(doc, state, 20);

        try (PDPageContentStream content = new PDPageContentStream(
                doc,
                state.page,
                PDPageContentStream.AppendMode.APPEND,
                true
        )) {
            content.beginText();
            content.setFont(bold ? FONT_BOLD : FONT, size);
            content.newLineAtOffset(MARGIN, state.y);
            content.showText(safe(text));
            content.endText();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        state.y -= 20;
        return state;
    }

    private PageState writeTable(PDDocument doc, PageState state,
                                 ReportTable table) {

        float tableWidth = 540;
        float rowHeight = 20;
        float startX = MARGIN;

        int cols = 0;

        boolean hasHeader = table.headers() != null && !table.headers().isEmpty();
        List<String> headers = hasHeader ? table.headers() : null;

        if (hasHeader) {
            cols = headers.size();
        } else if (table.rows() != null && !table.rows().isEmpty()) {
            cols = table.rows().getFirst().size();
        }

        if (cols == 0) return state;

        float colWidth = tableWidth / cols;

        try {

            // HEADER
            if (hasHeader) {
                state = ensureSpace(doc, state, rowHeight * 2);

                try (PDPageContentStream content = new PDPageContentStream(
                        doc, state.page,
                        PDPageContentStream.AppendMode.APPEND, true)) {

                    float headerHeight = drawRow(content, headers, startX, state.y, colWidth, true);
                    state.y -= headerHeight;
                }
            }

            // FILAS
            if (table.rows() != null) {
                for (var row : table.rows()) {

                    float estimatedHeight = 60;

                    if (state.y - estimatedHeight < BOTTOM_MARGIN) {
                        PDPage newPage = new PDPage();
                        doc.addPage(newPage);
                        state = new PageState(newPage, START_Y);

                        // repetir header
                        if (hasHeader) {
                            try (PDPageContentStream content = new PDPageContentStream(
                                    doc, state.page,
                                    PDPageContentStream.AppendMode.APPEND, true)) {

                                float headerHeight = drawRow(content, headers, startX, state.y, colWidth, true);
                                state.y -= headerHeight;
                            }
                        }
                    }

                    try (PDPageContentStream content = new PDPageContentStream(
                            doc, state.page,
                            PDPageContentStream.AppendMode.APPEND, true)) {

                        float dynamicHeight = drawRow(content, row, startX, state.y, colWidth, false);
                        state.y -= dynamicHeight;
                    }
                }
            }

        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        return state;
    }

    private float drawRow(PDPageContentStream content,
                          List<String> row,
                          float startX,
                          float y,
                          float colWidth,
                          boolean bold) throws Exception {

        PDType1Font font = bold ? FONT_BOLD : FONT;
        int fontSize = 10;
        float padding = 2;

        List<List<String>> wrappedCells = new java.util.ArrayList<>();
        int maxLines = 1;

        for (String cell : row) {
            List<String> lines = wrapText(cell, colWidth - 4, font, fontSize);
            wrappedCells.add(lines);
            maxLines = Math.max(maxLines, lines.size());
        }

        float rowHeight = (fontSize + 2) * maxLines + 4;

        float x = startX;

        for (List<String> cellLines : wrappedCells) {

            content.addRect(x, y - rowHeight, colWidth, rowHeight);
            content.stroke();

            float textY = y - fontSize - padding;

            for (String line : cellLines) {
                content.beginText();
                content.setFont(font, fontSize);
                content.newLineAtOffset(x + padding, textY);
                content.showText(line);
                content.endText();

                textY -= (fontSize + 2);
            }

            x += colWidth;
        }

        return rowHeight;
    }

    private List<String> wrapText(String text, float maxWidth, PDType1Font font, int fontSize) throws Exception {

        List<String> lines = new java.util.ArrayList<>();

        String[] words = safe(text).split(" ");
        StringBuilder currentLine = new StringBuilder();

        for (String word : words) {

            String testLine = currentLine.isEmpty() ? word : currentLine + " " + word;

            float size = font.getStringWidth(testLine) / 1000 * fontSize;

            if (size > maxWidth) {
                lines.add(currentLine.toString());
                currentLine = new StringBuilder(word);
            } else {
                currentLine = new StringBuilder(testLine);
            }
        }

        if (!currentLine.isEmpty()) {
            lines.add(currentLine.toString());
        }

        return lines;
    }

    private String safe(String s) {
        if (s == null) return "";
        return s.replace("\n", " ");
    }
}
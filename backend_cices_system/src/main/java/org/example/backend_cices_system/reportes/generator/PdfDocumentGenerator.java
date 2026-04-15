package org.example.backend_cices_system.reportes.generator;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.example.backend_cices_system.reportes.model.*;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.util.List;

@Component
public class PdfDocumentGenerator implements DocumentGenerator {
    private static final float MARGIN = 30;
    private static final float START_Y = 750;
    private static final float BOTTOM_MARGIN = 50;

    private PDPage ensureSpace(PDDocument doc, PDPage currentPage, float neededHeight, float yRef[]) {
        if (yRef[0] - neededHeight < BOTTOM_MARGIN) {
            PDPage newPage = new PDPage();
            doc.addPage(newPage);
            yRef[0] = START_Y;
            return newPage;
        }
        return currentPage;
    }

    @Override
    public DocumentFormat getFormat() {
        return DocumentFormat.PDF;
    }

    @Override
    public byte[] generate(ReportDocument doc) {
        try {
            PDDocument pdf = new PDDocument();
            PDPage page = new PDPage();
            pdf.addPage(page);

            float y = 750;

            for (ReportSection section : doc.sections()) {

                y = writeText(pdf, page, safe(section.heading()), 18, true, y);

                for (ReportElement element : section.elements()) {

                    if (element instanceof ReportParagraph(String text)) {
                        y = writeText(pdf, page, safe(text), 11, false, y);
                        y -= 8;
                    }

                    if (element instanceof ReportTable t) {
                        y = writeTable(pdf, page, t, y);
                        y -= 25;
                    }
                }
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            pdf.save(out);
            pdf.close();

            return out.toByteArray();

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error generando PDF", e);
        }
    }

    private float writeText(PDDocument doc, PDPage page,
                            String text, int size, boolean bold, float y) {

        float[] yRef = new float[]{y};

        try {
            page = ensureSpace(doc, page, 20, yRef);

            try (var content = new PDPageContentStream(doc, page,
                    PDPageContentStream.AppendMode.APPEND, true)) {

                content.beginText();
                content.setFont(
                        bold ? PDType1Font.HELVETICA_BOLD : PDType1Font.HELVETICA,
                        size
                );
                content.newLineAtOffset(30, yRef[0]);
                content.showText(safe(text));
                content.endText();
            }

        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        return yRef[0] - 20;
    }

    private float writeTable(PDDocument doc, PDPage page,
                             ReportTable table, float y) {

        float[] yRef = new float[]{y};

        float tableWidth = 540;
        float rowHeight = 20;
        float startX = MARGIN;

        int cols = 0;

        boolean hasHeader = table.headers() != null && !table.headers().isEmpty();
        List<String> headers = hasHeader ? table.headers() : null;

        if (table.headers() != null && !table.headers().isEmpty()) {
            cols = table.headers().size();
        } else if (table.rows() != null && !table.rows().isEmpty()) {
            cols = table.rows().get(0).size();
        }

        if (cols == 0) return y;

        float colWidth = tableWidth / cols;

        try {

            // HEADER
            if (table.headers() != null && !table.headers().isEmpty()) {

                float neededHeight = rowHeight + rowHeight; // header + 1 fila

                page = ensureSpace(doc, page, neededHeight, yRef);

                float dynamicHeight;

                float headerHeight;

                try (var content = new PDPageContentStream(doc, page,
                        PDPageContentStream.AppendMode.APPEND, true)) {

                    headerHeight = drawRow(content, headers, startX, yRef[0], colWidth, true);
                }

                yRef[0] -= headerHeight;
            }

            // FILAS
            if (table.rows() != null) {
                for (var row : table.rows()) {

                    float estimatedHeight = 20 * 3; // aprox o calcula wrap antes

                    if (yRef[0] - estimatedHeight < BOTTOM_MARGIN) {
                        page = new PDPage();
                        doc.addPage(page);
                        yRef[0] = START_Y;

                        // repetir header
                        if (hasHeader) {
                            float headerHeight;

                            try (var content = new PDPageContentStream(doc, page,
                                    PDPageContentStream.AppendMode.APPEND, true)) {

                                headerHeight = drawRow(content, headers, startX, yRef[0], colWidth, true);
                            }

                            yRef[0] -= headerHeight;
                        }
                    }

                    float dynamicHeight;

                    try (var content = new PDPageContentStream(doc, page,
                            PDPageContentStream.AppendMode.APPEND, true)) {

                        dynamicHeight = drawRow(content, row, startX, yRef[0], colWidth, false);
                    }

                    yRef[0] -= dynamicHeight;
                }
            }

        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        return yRef[0];
    }

    private float drawRow(PDPageContentStream content,
                          List<String> row,
                          float startX,
                          float y,
                          float colWidth,
                          boolean bold) throws Exception {

        PDType1Font font = bold ? PDType1Font.HELVETICA_BOLD : PDType1Font.HELVETICA;
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

            // borde
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
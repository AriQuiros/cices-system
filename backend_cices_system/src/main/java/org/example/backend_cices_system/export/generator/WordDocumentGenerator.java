package org.example.backend_cices_system.export.generator;

import lombok.RequiredArgsConstructor;
import org.apache.poi.xwpf.usermodel.*;
import org.example.backend_cices_system.export.builder.WordHeaderBuilder;
import org.example.backend_cices_system.export.model.*;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.util.List;

@Component
@RequiredArgsConstructor
public class WordDocumentGenerator implements DocumentGenerator {

    private final WordHeaderBuilder headerBuilder;

    @Override
    public DocumentFormat getFormat() {
        return DocumentFormat.WORD;
    }

    @Override
    public byte[] generate(ReportDocument doc) {

        try (
                InputStream is = getClass()
                        .getClassLoader()
                        .getResourceAsStream("templates/plantilla_word.docx")
        ) {
            assert is != null;
            try (XWPFDocument document = new XWPFDocument(is);

                 ByteArrayOutputStream out = new ByteArrayOutputStream()
            ) {

                // =========================
                // HEADER
                // =========================
                headerBuilder.buildHeader(document, doc);

                // =========================
                // CONTENIDO
                // =========================
                for (ReportSection section : doc.sections()) {

                    // Heading
                    XWPFParagraph heading = document.createParagraph();
                    heading.setStyle("Heading" + section.level());

                    heading.createRun().setText(section.heading());

                    for (ReportElement element : section.elements()) {

                        if (element instanceof ReportParagraph(String text)) {
                            XWPFParagraph p = document.createParagraph();
                            p.createRun().setText(text);
                        }

                        if (element instanceof ReportTable table) {
                            createTable(document, table);
                        }
                    }
                }

                document.write(out);
                return out.toByteArray();

            }
        } catch (Exception e) {
            throw new RuntimeException("Error generando Word", e);
        }
    }

    // =========================
    // TABLA
    // =========================
    private void createTable(XWPFDocument document, ReportTable tableData) {

        int rows = (tableData.rows() != null ? tableData.rows().size() : 0)
                + (tableData.headers() != null ? 1 : 0);

        int cols = tableData.headers() != null
                ? tableData.headers().size()
                : (tableData.rows() != null && !tableData.rows().isEmpty()
                ? tableData.rows().getFirst().size()
                : 1);

        XWPFTable table = document.createTable(rows, cols);

        int rowIndex = 0;

        // HEADER
        if (tableData.headers() != null) {
            XWPFTableRow headerRow = table.getRow(rowIndex++);

            for (int i = 0; i < tableData.headers().size(); i++) {
                XWPFTableCell cell = headerRow.getCell(i);
                setCellText(cell, tableData.headers().get(i), true);
            }
        }

        // ROWS
        if (tableData.rows() != null) {
            for (List<String> row : tableData.rows()) {

                XWPFTableRow tableRow = table.getRow(rowIndex++);

                for (int i = 0; i < row.size(); i++) {
                    setCellText(tableRow.getCell(i), row.get(i), false);
                }
            }
        }
    }

    // =========================
    // CELL
    // =========================
    private void setCellText(XWPFTableCell cell, String text, boolean bold) {

        XWPFParagraph p = clearParagraph(cell);

        XWPFRun run = p.createRun();
        run.setText(text != null ? text : "");
        run.setBold(bold);
    }

    private XWPFParagraph clearParagraph(XWPFTableCell cell) {
        while (!cell.getParagraphs().isEmpty()) {
            cell.removeParagraph(0);
        }
        return cell.addParagraph();
    }
}
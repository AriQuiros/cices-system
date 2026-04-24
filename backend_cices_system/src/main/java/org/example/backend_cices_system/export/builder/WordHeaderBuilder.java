package org.example.backend_cices_system.export.builder;

import org.apache.poi.xwpf.usermodel.*;
import org.example.backend_cices_system.export.model.ReportDocument;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class WordHeaderBuilder {

    public void buildHeader(XWPFDocument document, ReportDocument doc) {

        Map<String, String> values = Map.of(
                "${titulo}", doc.title(),
                "${fecha}", doc.date().toString()
        );

        replaceInHeaders(document, values);
    }

    // =========================
    // HEADER REPLACE
    // =========================
    private void replaceInHeaders(XWPFDocument document, Map<String, String> values) {

        for (XWPFHeader header : document.getHeaderList()) {

            // párrafos directos
            for (XWPFParagraph paragraph : header.getParagraphs()) {
                replaceInParagraph(paragraph, values);
            }

            // tablas dentro del header (TU CASO)
            for (XWPFTable table : header.getTables()) {
                for (XWPFTableRow row : table.getRows()) {
                    for (XWPFTableCell cell : row.getTableCells()) {
                        for (XWPFParagraph paragraph : cell.getParagraphs()) {
                            replaceInParagraph(paragraph, values);
                        }
                    }
                }
            }
        }
    }

    // =========================
    // PARAGRAPH REPLACE
    // =========================
    private void replaceInParagraph(XWPFParagraph paragraph, Map<String, String> values) {

        for (XWPFRun run : paragraph.getRuns()) {
            String text = run.getText(0);

            if (text == null) continue;

            for (Map.Entry<String, String> entry : values.entrySet()) {
                text = text.replace(entry.getKey(), entry.getValue());
            }

            run.setText(text, 0);
        }
    }
}
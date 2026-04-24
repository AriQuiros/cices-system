package org.example.backend_cices_system.export.generator;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.example.backend_cices_system.export.model.*;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;

@Component
public class ExcelDocumentGenerator implements DocumentGenerator {

    @Override
    public DocumentFormat getFormat() {
        return DocumentFormat.EXCEL;
    }

    @Override
    public byte[] generate(ReportDocument doc) {
        try {
            XSSFWorkbook workbook = new XSSFWorkbook();
            XSSFSheet sheet = workbook.createSheet("Reporte");

            int rowIndex = 0;

            for (ReportSection section : doc.sections()) {

                Row title = sheet.createRow(rowIndex++);
                title.createCell(0).setCellValue(safe(section.heading()));

                for (ReportElement element : section.elements()) {

                    if (element instanceof ReportParagraph p) {
                        Row row = sheet.createRow(rowIndex++);
                        row.createCell(0).setCellValue(safe(p.text()));
                    }

                    if (element instanceof ReportTable t) {
                        rowIndex = writeTable(sheet, t, rowIndex);
                    }
                }
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);
            workbook.close();

            return out.toByteArray();

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error generando Excel", e);
        }
    }

    private int writeTable(XSSFSheet sheet, ReportTable table, int rowIndex) {

        // HEADERS (opcionales)
        if (table.headers() != null && !table.headers().isEmpty()) {
            Row header = sheet.createRow(rowIndex++);
            int col = 0;

            for (String h : table.headers()) {
                header.createCell(col++).setCellValue(safe(h));
            }
        }

        // FILAS (opcionales)
        if (table.rows() != null && !table.rows().isEmpty()) {

            for (var rowData : table.rows()) {

                Row row = sheet.createRow(rowIndex++);
                int col = 0;

                for (String val : rowData) {
                    row.createCell(col++).setCellValue(safe(val));
                }
            }
        }

        return rowIndex + 1; // espacio entre tablas
    }

    private String safe(String s) {
        if (s == null) return "";
        return s.replace("\n", " ");
    }
}
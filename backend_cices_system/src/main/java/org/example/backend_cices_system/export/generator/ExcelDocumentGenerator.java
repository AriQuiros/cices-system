package org.example.backend_cices_system.export.generator;

import org.apache.poi.ss.usermodel.*;
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

            // ── Estilos ──────────────────────────────────────────────────
            CellStyle styleHeader = workbook.createCellStyle();
            Font fontHeader = workbook.createFont();
            fontHeader.setBold(true);
            fontHeader.setFontHeightInPoints((short) 13);
            styleHeader.setFont(fontHeader);
            styleHeader.setAlignment(HorizontalAlignment.CENTER);

            CellStyle styleSubHeader = workbook.createCellStyle();
            Font fontSub = workbook.createFont();
            fontSub.setFontHeightInPoints((short) 10);
            styleSubHeader.setFont(fontSub);
            styleSubHeader.setAlignment(HorizontalAlignment.CENTER);

            // ── Encabezado ───────────────────────────────────────────────
            int rowIndex = 0;

            // Fila 1: Nombre del sistema
            Row rowSistema = sheet.createRow(rowIndex++);
            Cell cellSistema = rowSistema.createCell(0);
            cellSistema.setCellValue(safe(doc.systemName()));
            cellSistema.setCellStyle(styleHeader);

            // Fila 2: Título del reporte
            Row rowTitulo = sheet.createRow(rowIndex++);
            Cell cellTitulo = rowTitulo.createCell(0);
            cellTitulo.setCellValue(safe(doc.title()));
            cellTitulo.setCellStyle(styleSubHeader);

            // Fila 3: Fecha
            Row rowFecha = sheet.createRow(rowIndex++);
            Cell cellFecha = rowFecha.createCell(0);
            String fechaStr = doc.date() != null
                    ? "Fecha: " + doc.date().format(java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy"))
                    : "";
            cellFecha.setCellValue(fechaStr);
            cellFecha.setCellStyle(styleSubHeader);

            // Fila 4: espacio en blanco
            rowIndex++;

            // ── Contenido ────────────────────────────────────────────────
            for (ReportSection section : doc.sections()) {

                Row title = sheet.createRow(rowIndex++);
                Cell titleCell = title.createCell(0);
                titleCell.setCellValue(safe(section.heading()));

                CellStyle sectionStyle = workbook.createCellStyle();
                Font sectionFont = workbook.createFont();
                sectionFont.setBold(true);
                sectionStyle.setFont(sectionFont);
                titleCell.setCellStyle(sectionStyle);

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

            // Autoajuste de columnas
            sheet.autoSizeColumn(0);

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
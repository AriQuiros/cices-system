package org.example.backend_cices_system.report.serviceVw;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.apache.poi.xwpf.usermodel.*;
import org.example.backend_cices_system.report.dto.RepInvestigadoresParticipantesDTO;
import org.openxmlformats.schemas.wordprocessingml.x2006.main.*;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.Color;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.math.BigInteger;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@Service
public class RepInvestigadoresParticipantesArchivoService {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    private static final String NOMBRE_REPORTE = "Reporte de investigadores participantes en proyectos";
    private static final String NOMBRE_SISTEMA = "Sistema de Información del CICEC";

    private static final String LOGO_CICES = "static/images/logoCICES.png";
    private static final String LOGO_UCR = "static/images/logoUCR.png";

    public byte[] generarArchivo(
            String formato,
            List<RepInvestigadoresParticipantesDTO> datos,
            long totalInvestigadores,
            Map<String, Long> totalPorRol,
            Map<String, Long> totalPorProyecto
    ) {
        if ("pdf".equalsIgnoreCase(formato)) {
            return generarPdf(datos, totalInvestigadores, totalPorRol, totalPorProyecto);
        }

        if ("xlsx".equalsIgnoreCase(formato)) {
            return generarExcel(datos, totalInvestigadores, totalPorRol, totalPorProyecto);
        }

        if ("docx".equalsIgnoreCase(formato)) {
            return generarWord(datos, totalInvestigadores, totalPorRol, totalPorProyecto);
        }

        throw new RuntimeException("Formato no soportado: " + formato);
    }

    public String obtenerContentType(String formato) {
        if ("pdf".equalsIgnoreCase(formato)) {
            return "application/pdf";
        }

        if ("xlsx".equalsIgnoreCase(formato)) {
            return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        }

        if ("docx".equalsIgnoreCase(formato)) {
            return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        }

        throw new RuntimeException("Formato no soportado: " + formato);
    }

    public String obtenerExtension(String formato) {
        if ("pdf".equalsIgnoreCase(formato)) {
            return "pdf";
        }

        if ("xlsx".equalsIgnoreCase(formato)) {
            return "xlsx";
        }

        if ("docx".equalsIgnoreCase(formato)) {
            return "docx";
        }

        throw new RuntimeException("Formato no soportado: " + formato);
    }

    private String obtenerFechaCreacion() {
        return LocalDateTime.now().format(DATE_TIME_FORMATTER);
    }

    // =========================================================
    // EXCEL
    // =========================================================

    private byte[] generarExcel(
            List<RepInvestigadoresParticipantesDTO> datos,
            long totalInvestigadores,
            Map<String, Long> totalPorRol,
            Map<String, Long> totalPorProyecto
    ) {
        try (Workbook workbook = new XSSFWorkbook();
             ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {

            Sheet sheet = workbook.createSheet("Investigadores");

            // Hoja normal de Excel.
            sheet.setDisplayGridlines(true);
            sheet.setPrintGridlines(false);

            int[] widths = {18, 35, 22, 32, 25, 22, 18, 25, 25};
            for (int i = 0; i < widths.length; i++) {
                sheet.setColumnWidth(i, widths[i] * 256);
            }

            CellStyle tituloStyle = workbook.createCellStyle();
            org.apache.poi.ss.usermodel.Font tituloFont = workbook.createFont();
            tituloFont.setBold(true);
            tituloFont.setFontHeightInPoints((short) 16);
            tituloStyle.setFont(tituloFont);
            tituloStyle.setAlignment(HorizontalAlignment.CENTER);
            tituloStyle.setVerticalAlignment(VerticalAlignment.CENTER);

            CellStyle sistemaStyle = workbook.createCellStyle();
            org.apache.poi.ss.usermodel.Font sistemaFont = workbook.createFont();
            sistemaFont.setBold(true);
            sistemaFont.setFontHeightInPoints((short) 13);
            sistemaStyle.setFont(sistemaFont);
            sistemaStyle.setAlignment(HorizontalAlignment.CENTER);
            sistemaStyle.setVerticalAlignment(VerticalAlignment.CENTER);

            CellStyle fechaStyle = workbook.createCellStyle();
            org.apache.poi.ss.usermodel.Font fechaFont = workbook.createFont();
            fechaFont.setFontHeightInPoints((short) 10);
            fechaStyle.setFont(fechaFont);
            fechaStyle.setAlignment(HorizontalAlignment.CENTER);

            CellStyle sectionStyle = workbook.createCellStyle();
            org.apache.poi.ss.usermodel.Font sectionFont = workbook.createFont();
            sectionFont.setBold(true);
            sectionFont.setFontHeightInPoints((short) 12);
            sectionStyle.setFont(sectionFont);
            sectionStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
            sectionStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            sectionStyle.setBorderBottom(BorderStyle.THIN);
            sectionStyle.setBorderTop(BorderStyle.THIN);
            sectionStyle.setBorderLeft(BorderStyle.THIN);
            sectionStyle.setBorderRight(BorderStyle.THIN);

            CellStyle labelStyle = workbook.createCellStyle();
            org.apache.poi.ss.usermodel.Font labelFont = workbook.createFont();
            labelFont.setBold(true);
            labelStyle.setFont(labelFont);
            labelStyle.setBorderBottom(BorderStyle.THIN);
            labelStyle.setBorderTop(BorderStyle.THIN);
            labelStyle.setBorderLeft(BorderStyle.THIN);
            labelStyle.setBorderRight(BorderStyle.THIN);
            labelStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
            labelStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

            CellStyle valueStyle = workbook.createCellStyle();
            valueStyle.setBorderBottom(BorderStyle.THIN);
            valueStyle.setBorderTop(BorderStyle.THIN);
            valueStyle.setBorderLeft(BorderStyle.THIN);
            valueStyle.setBorderRight(BorderStyle.THIN);

            CellStyle headerStyle = workbook.createCellStyle();
            org.apache.poi.ss.usermodel.Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setColor(IndexedColors.BLACK.getIndex());
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.LIGHT_CORNFLOWER_BLUE.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerStyle.setBorderBottom(BorderStyle.THIN);
            headerStyle.setBorderTop(BorderStyle.THIN);
            headerStyle.setBorderLeft(BorderStyle.THIN);
            headerStyle.setBorderRight(BorderStyle.THIN);
            headerStyle.setAlignment(HorizontalAlignment.CENTER);
            headerStyle.setVerticalAlignment(VerticalAlignment.CENTER);
            headerStyle.setWrapText(true);

            CellStyle dataStyle = workbook.createCellStyle();
            dataStyle.setBorderBottom(BorderStyle.THIN);
            dataStyle.setBorderTop(BorderStyle.THIN);
            dataStyle.setBorderLeft(BorderStyle.THIN);
            dataStyle.setBorderRight(BorderStyle.THIN);
            dataStyle.setVerticalAlignment(VerticalAlignment.TOP);
            dataStyle.setWrapText(true);

            int rowIndex = 0;

            for (int i = 0; i <= 3; i++) {
                Row row = sheet.createRow(i);
                row.setHeightInPoints(24);
            }

            agregarImagenExcel(workbook, sheet, LOGO_CICES, 0, 0, 2, 3);
            agregarImagenExcel(workbook, sheet, LOGO_UCR, 7, 0, 9, 3);

            Row sistemaRow = sheet.getRow(rowIndex++);
            Cell sistemaCell = sistemaRow.createCell(2);
            sistemaCell.setCellValue(NOMBRE_SISTEMA);
            sistemaCell.setCellStyle(sistemaStyle);
            sheet.addMergedRegion(new CellRangeAddress(0, 0, 2, 6));

            Row tituloRow = sheet.getRow(rowIndex++);
            Cell tituloCell = tituloRow.createCell(2);
            tituloCell.setCellValue(NOMBRE_REPORTE);
            tituloCell.setCellStyle(tituloStyle);
            sheet.addMergedRegion(new CellRangeAddress(1, 1, 2, 6));

            Row fechaRow = sheet.getRow(rowIndex++);
            Cell fechaCell = fechaRow.createCell(2);
            fechaCell.setCellValue("Fecha de creación: " + obtenerFechaCreacion());
            fechaCell.setCellStyle(fechaStyle);
            sheet.addMergedRegion(new CellRangeAddress(2, 2, 2, 6));

            rowIndex = 5;

            rowIndex = crearTituloSeccionExcel(sheet, rowIndex, "Resumen general", sectionStyle, 0, 2);

            Row totalInvestigadoresRow = sheet.createRow(rowIndex++);
            crearCelda(totalInvestigadoresRow, 0, "Total de investigadores únicos", labelStyle);
            crearCelda(totalInvestigadoresRow, 1, String.valueOf(totalInvestigadores), valueStyle);

            Row totalParticipacionesRow = sheet.createRow(rowIndex++);
            crearCelda(totalParticipacionesRow, 0, "Total de participaciones", labelStyle);
            crearCelda(totalParticipacionesRow, 1, String.valueOf(datos.size()), valueStyle);

            rowIndex += 2;

            rowIndex = crearTituloSeccionExcel(sheet, rowIndex, "Resumen por proyecto", sectionStyle, 0, 2);

            Row resumenProyectoHeader = sheet.createRow(rowIndex++);
            crearCelda(resumenProyectoHeader, 0, "Proyecto", headerStyle);
            crearCelda(resumenProyectoHeader, 1, "Cantidad de investigadores", headerStyle);

            if (totalPorProyecto.isEmpty()) {
                Row row = sheet.createRow(rowIndex++);
                crearCelda(row, 0, "No hay datos para mostrar.", dataStyle);
                crearCelda(row, 1, "", dataStyle);
            } else {
                for (Map.Entry<String, Long> entry : totalPorProyecto.entrySet()) {
                    Row proyectoRow = sheet.createRow(rowIndex++);
                    crearCelda(proyectoRow, 0, entry.getKey(), dataStyle);
                    crearCelda(proyectoRow, 1, String.valueOf(entry.getValue()), dataStyle);
                }
            }

            rowIndex += 2;

            rowIndex = crearTituloSeccionExcel(sheet, rowIndex, "Resumen por rol", sectionStyle, 0, 2);

            Row resumenRolHeader = sheet.createRow(rowIndex++);
            crearCelda(resumenRolHeader, 0, "Rol", headerStyle);
            crearCelda(resumenRolHeader, 1, "Cantidad", headerStyle);

            if (totalPorRol.isEmpty()) {
                Row row = sheet.createRow(rowIndex++);
                crearCelda(row, 0, "No hay datos para mostrar.", dataStyle);
                crearCelda(row, 1, "", dataStyle);
            } else {
                for (Map.Entry<String, Long> entry : totalPorRol.entrySet()) {
                    Row rolRow = sheet.createRow(rowIndex++);
                    crearCelda(rolRow, 0, entry.getKey(), dataStyle);
                    crearCelda(rolRow, 1, String.valueOf(entry.getValue()), dataStyle);
                }
            }

            rowIndex += 2;

            rowIndex = crearTituloSeccionExcel(sheet, rowIndex, "Detalle de investigadores", sectionStyle, 0, 8);

            String[] headers = obtenerHeaders();
            Row headerRow = sheet.createRow(rowIndex++);
            headerRow.setHeightInPoints(28);

            for (int i = 0; i < headers.length; i++) {
                crearCelda(headerRow, i, headers[i], headerStyle);
            }

            for (RepInvestigadoresParticipantesDTO item : datos) {
                Row row = sheet.createRow(rowIndex++);
                String[] valores = obtenerValoresFila(item);

                for (int i = 0; i < valores.length; i++) {
                    crearCelda(row, i, valores[i], dataStyle);
                }
            }

            sheet.createFreezePane(0, headerRow.getRowNum() + 1);

            workbook.write(outputStream);
            return outputStream.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Error generando Excel del reporte", e);
        }
    }

    private void agregarImagenExcel(
            Workbook workbook,
            Sheet sheet,
            String classpath,
            int col1,
            int row1,
            int col2,
            int row2
    ) {
        try (InputStream inputStream = new ClassPathResource(classpath).getInputStream()) {
            byte[] bytes = inputStream.readAllBytes();

            int pictureIdx = workbook.addPicture(bytes, Workbook.PICTURE_TYPE_PNG);

            CreationHelper helper = workbook.getCreationHelper();
            Drawing<?> drawing = sheet.createDrawingPatriarch();
            ClientAnchor anchor = helper.createClientAnchor();

            anchor.setAnchorType(ClientAnchor.AnchorType.MOVE_AND_RESIZE);

            anchor.setCol1(col1);
            anchor.setRow1(row1);
            anchor.setCol2(col2);
            anchor.setRow2(row2);

            Picture picture = drawing.createPicture(anchor, pictureIdx);

            // No usar picture.resize(), porque deforma o agranda la imagen según su tamaño original.

        } catch (Exception ignored) {
            // Si el logo no existe, el reporte igual se genera.
        }
    }

    private int crearTituloSeccionExcel(
            Sheet sheet,
            int rowIndex,
            String titulo,
            CellStyle style,
            int colInicio,
            int colFin
    ) {
        Row row = sheet.createRow(rowIndex++);
        Cell cell = row.createCell(colInicio);
        cell.setCellValue(titulo);
        cell.setCellStyle(style);

        for (int i = colInicio + 1; i <= colFin; i++) {
            Cell extraCell = row.createCell(i);
            extraCell.setCellStyle(style);
        }

        sheet.addMergedRegion(new CellRangeAddress(row.getRowNum(), row.getRowNum(), colInicio, colFin));
        return rowIndex;
    }

    private void crearCelda(Row row, int col, String valor, CellStyle style) {
        Cell cell = row.createCell(col);
        cell.setCellValue(valor != null ? valor : "");
        cell.setCellStyle(style);
    }

    // =========================================================
    // WORD
    // =========================================================

    private byte[] generarWord(
            List<RepInvestigadoresParticipantesDTO> datos,
            long totalInvestigadores,
            Map<String, Long> totalPorRol,
            Map<String, Long> totalPorProyecto
    ) {
        try (XWPFDocument document = new XWPFDocument();
             ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {

            configurarWordHorizontal(document);

            XWPFTable headerTable = document.createTable(1, 3);
            headerTable.setWidth("100%");
            headerTable.setTableAlignment(TableRowAlign.CENTER);
            fijarAnchoTablaWord(headerTable, new int[]{2200, 7600, 2200});
            estilizarTablaWord(headerTable, 9);

            XWPFTableRow headerRow = headerTable.getRow(0);
            evitarCorteFilaWord(headerRow);

            agregarImagenWord(headerRow.getCell(0), LOGO_CICES, 75);

            XWPFParagraph centro = limpiarParrafoCelda(headerRow.getCell(1));
            centro.setAlignment(ParagraphAlignment.CENTER);

            XWPFRun sistemaRun = centro.createRun();
            sistemaRun.setText(NOMBRE_SISTEMA);
            sistemaRun.setBold(true);
            sistemaRun.setFontSize(11);
            sistemaRun.addBreak();

            XWPFRun tituloRun = centro.createRun();
            tituloRun.setText(NOMBRE_REPORTE);
            tituloRun.setBold(true);
            tituloRun.setFontSize(14);
            tituloRun.addBreak();

            XWPFRun fechaRun = centro.createRun();
            fechaRun.setText("Fecha de creación: " + obtenerFechaCreacion());
            fechaRun.setFontSize(9);

            agregarImagenWord(headerRow.getCell(2), LOGO_UCR, 70);

            crearEspacioWord(document);

            crearSubtituloWord(document, "Resumen general");

            XWPFTable resumenGeneral = document.createTable(2, 2);
            resumenGeneral.setWidth("55%");
            resumenGeneral.setTableAlignment(TableRowAlign.CENTER);
            fijarAnchoTablaWord(resumenGeneral, new int[]{3600, 1200});

            resumenGeneral.getRow(0).getCell(0).setText("Total de investigadores únicos");
            resumenGeneral.getRow(0).getCell(1).setText(String.valueOf(totalInvestigadores));
            resumenGeneral.getRow(1).getCell(0).setText("Total de participaciones");
            resumenGeneral.getRow(1).getCell(1).setText(String.valueOf(datos.size()));

            estilizarTablaWord(resumenGeneral, 8);
            evitarCortesTablaWord(resumenGeneral);

            crearEspacioWord(document);

            crearSubtituloWord(document, "Resumen por proyecto");

            XWPFTable tablaProyecto = document.createTable(Math.max(totalPorProyecto.size() + 1, 2), 2);
            tablaProyecto.setWidth("100%");
            tablaProyecto.setTableAlignment(TableRowAlign.CENTER);
            fijarAnchoTablaWord(tablaProyecto, new int[]{8500, 2500});

            tablaProyecto.getRow(0).getCell(0).setText("Proyecto");
            tablaProyecto.getRow(0).getCell(1).setText("Cantidad de investigadores");

            if (totalPorProyecto.isEmpty()) {
                tablaProyecto.getRow(1).getCell(0).setText("No hay datos para mostrar.");
                tablaProyecto.getRow(1).getCell(1).setText("");
            } else {
                int index = 1;
                for (Map.Entry<String, Long> entry : totalPorProyecto.entrySet()) {
                    tablaProyecto.getRow(index).getCell(0).setText(entry.getKey());
                    tablaProyecto.getRow(index).getCell(1).setText(String.valueOf(entry.getValue()));
                    index++;
                }
            }

            estilizarTablaWord(tablaProyecto, 8);
            evitarCortesTablaWord(tablaProyecto);

            crearEspacioWord(document);

            crearSubtituloWord(document, "Resumen por rol");

            XWPFTable tablaRol = document.createTable(Math.max(totalPorRol.size() + 1, 2), 2);
            tablaRol.setWidth("55%");
            tablaRol.setTableAlignment(TableRowAlign.CENTER);
            fijarAnchoTablaWord(tablaRol, new int[]{3600, 1200});

            tablaRol.getRow(0).getCell(0).setText("Rol");
            tablaRol.getRow(0).getCell(1).setText("Cantidad");

            if (totalPorRol.isEmpty()) {
                tablaRol.getRow(1).getCell(0).setText("No hay datos para mostrar.");
                tablaRol.getRow(1).getCell(1).setText("");
            } else {
                int index = 1;
                for (Map.Entry<String, Long> entry : totalPorRol.entrySet()) {
                    tablaRol.getRow(index).getCell(0).setText(entry.getKey());
                    tablaRol.getRow(index).getCell(1).setText(String.valueOf(entry.getValue()));
                    index++;
                }
            }

            estilizarTablaWord(tablaRol, 8);
            evitarCortesTablaWord(tablaRol);

            crearEspacioWord(document);
            crearSubtituloWord(document, "Detalle de investigadores");

            XWPFTable table = document.createTable();
            table.setWidth("100%");
            table.setTableAlignment(TableRowAlign.CENTER);

            String[] headers = obtenerHeadersCortosWord();

            XWPFTableRow tableHeaderRow = table.getRow(0);
            tableHeaderRow.getCell(0).setText(headers[0]);

            for (int i = 1; i < headers.length; i++) {
                tableHeaderRow.addNewTableCell().setText(headers[i]);
            }

            for (RepInvestigadoresParticipantesDTO item : datos) {
                XWPFTableRow row = table.createRow();
                String[] valores = obtenerValoresFila(item);

                for (int i = 0; i < valores.length; i++) {
                    row.getCell(i).setText(valores[i]);
                }
            }

            fijarAnchoTablaWord(table, new int[]{1050, 1800, 1400, 1900, 1500, 1200, 900, 1300, 1300});
            estilizarTablaWord(table, 7);
            evitarCortesTablaWord(table);
            repetirEncabezadoTablaWord(table.getRow(0));

            document.write(outputStream);
            return outputStream.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Error generando Word del reporte", e);
        }
    }

    private void configurarWordHorizontal(XWPFDocument document) {
        CTSectPr section = document.getDocument().getBody().isSetSectPr()
                ? document.getDocument().getBody().getSectPr()
                : document.getDocument().getBody().addNewSectPr();

        CTPageSz pageSize = section.isSetPgSz()
                ? section.getPgSz()
                : section.addNewPgSz();

        pageSize.setOrient(STPageOrientation.LANDSCAPE);

        // Carta horizontal.
        pageSize.setW(BigInteger.valueOf(15840));
        pageSize.setH(BigInteger.valueOf(12240));

        CTPageMar margins = section.isSetPgMar()
                ? section.getPgMar()
                : section.addNewPgMar();

        margins.setTop(BigInteger.valueOf(720));
        margins.setBottom(BigInteger.valueOf(720));
        margins.setLeft(BigInteger.valueOf(720));
        margins.setRight(BigInteger.valueOf(720));
    }

    private void agregarImagenWord(XWPFTableCell cell, String classpath, int anchoObjetivoPx) {
        try (InputStream inputStream = new ClassPathResource(classpath).getInputStream()) {
            byte[] bytes = inputStream.readAllBytes();

            BufferedImage image = ImageIO.read(new ByteArrayInputStream(bytes));
            if (image == null || image.getWidth() <= 0) {
                return;
            }

            int altoObjetivoPx = (int) Math.round((double) anchoObjetivoPx * image.getHeight() / image.getWidth());

            XWPFParagraph paragraph = limpiarParrafoCelda(cell);
            paragraph.setAlignment(ParagraphAlignment.CENTER);

            XWPFRun run = paragraph.createRun();
            run.addPicture(
                    new ByteArrayInputStream(bytes),
                    XWPFDocument.PICTURE_TYPE_PNG,
                    classpath,
                    org.apache.poi.util.Units.toEMU(anchoObjetivoPx),
                    org.apache.poi.util.Units.toEMU(altoObjetivoPx)
            );

        } catch (Exception ignored) {
            XWPFParagraph paragraph = limpiarParrafoCelda(cell);
            paragraph.setAlignment(ParagraphAlignment.CENTER);
            paragraph.createRun().setText("");
        }
    }

    private XWPFParagraph limpiarParrafoCelda(XWPFTableCell cell) {
        while (cell.getParagraphs().size() > 0) {
            cell.removeParagraph(0);
        }

        return cell.addParagraph();
    }

    private void fijarAnchoTablaWord(XWPFTable table, int[] widths) {
        for (XWPFTableRow row : table.getRows()) {
            for (int i = 0; i < row.getTableCells().size() && i < widths.length; i++) {
                XWPFTableCell cell = row.getCell(i);

                CTTcPr tcPr = cell.getCTTc().isSetTcPr()
                        ? cell.getCTTc().getTcPr()
                        : cell.getCTTc().addNewTcPr();

                CTTblWidth tcW = tcPr.isSetTcW()
                        ? tcPr.getTcW()
                        : tcPr.addNewTcW();

                tcW.setW(BigInteger.valueOf(widths[i]));
                tcW.setType(STTblWidth.DXA);
            }
        }
    }

    private void estilizarTablaWord(XWPFTable table, int fontSize) {
        CTTblPr tblPr = table.getCTTbl().getTblPr();

        if (tblPr == null) {
            tblPr = table.getCTTbl().addNewTblPr();
        }

        CTTblBorders borders = tblPr.getTblBorders();

        if (borders == null) {
            borders = tblPr.addNewTblBorders();
        }

        if (!borders.isSetTop()) agregarBordeWord(borders.addNewTop());
        else agregarBordeWord(borders.getTop());

        if (!borders.isSetBottom()) agregarBordeWord(borders.addNewBottom());
        else agregarBordeWord(borders.getBottom());

        if (!borders.isSetLeft()) agregarBordeWord(borders.addNewLeft());
        else agregarBordeWord(borders.getLeft());

        if (!borders.isSetRight()) agregarBordeWord(borders.addNewRight());
        else agregarBordeWord(borders.getRight());

        if (!borders.isSetInsideH()) agregarBordeWord(borders.addNewInsideH());
        else agregarBordeWord(borders.getInsideH());

        if (!borders.isSetInsideV()) agregarBordeWord(borders.addNewInsideV());
        else agregarBordeWord(borders.getInsideV());

        for (int i = 0; i < table.getRows().size(); i++) {
            XWPFTableRow row = table.getRow(i);
            evitarCorteFilaWord(row);

            for (XWPFTableCell cell : row.getTableCells()) {
                cell.setVerticalAlignment(XWPFTableCell.XWPFVertAlign.CENTER);

                if (i == 0) {
                    sombrearCeldaWord(cell, "D9EAF7");
                    ponerNegritaCeldaWord(cell);
                }

                aplicarFuenteCeldaWord(cell, fontSize);
            }
        }
    }

    private void evitarCortesTablaWord(XWPFTable table) {
        for (XWPFTableRow row : table.getRows()) {
            evitarCorteFilaWord(row);
        }
    }

    private void evitarCorteFilaWord(XWPFTableRow row) {
        CTTrPr trPr = row.getCtRow().isSetTrPr()
                ? row.getCtRow().getTrPr()
                : row.getCtRow().addNewTrPr();

        trPr.addNewCantSplit();
    }

    private void repetirEncabezadoTablaWord(XWPFTableRow row) {
        CTTrPr trPr = row.getCtRow().isSetTrPr()
                ? row.getCtRow().getTrPr()
                : row.getCtRow().addNewTrPr();

        trPr.addNewTblHeader();
    }

    private void aplicarFuenteCeldaWord(XWPFTableCell cell, int fontSize) {
        for (XWPFParagraph paragraph : cell.getParagraphs()) {
            paragraph.setSpacingBefore(0);
            paragraph.setSpacingAfter(0);

            for (XWPFRun run : paragraph.getRuns()) {
                run.setFontSize(fontSize);
            }
        }
    }

    private void agregarBordeWord(CTBorder border) {
        border.setVal(STBorder.SINGLE);
        border.setSz(BigInteger.valueOf(6));
        border.setColor("A6A6A6");
    }

    private void sombrearCeldaWord(XWPFTableCell cell, String colorHex) {
        CTTcPr tcPr = cell.getCTTc().isSetTcPr()
                ? cell.getCTTc().getTcPr()
                : cell.getCTTc().addNewTcPr();

        CTShd shd = tcPr.isSetShd()
                ? tcPr.getShd()
                : tcPr.addNewShd();

        shd.setFill(colorHex);
    }

    private void ponerNegritaCeldaWord(XWPFTableCell cell) {
        for (XWPFParagraph paragraph : cell.getParagraphs()) {
            for (XWPFRun run : paragraph.getRuns()) {
                run.setBold(true);
            }
        }
    }

    // =========================================================
    // PDF
    // =========================================================

    private byte[] generarPdf(
            List<RepInvestigadoresParticipantesDTO> datos,
            long totalInvestigadores,
            Map<String, Long> totalPorRol,
            Map<String, Long> totalPorProyecto
    ) {
        try (PDDocument document = new PDDocument();
             ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {

            PDPage page = crearPaginaHorizontal();
            document.addPage(page);

            PDType1Font fontNormal = new PDType1Font(Standard14Fonts.FontName.HELVETICA);
            PDType1Font fontBold = new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD);

            PDPageContentStream content = new PDPageContentStream(document, page);

            float margin = 35;
            float y = page.getMediaBox().getHeight() - margin;

            y = dibujarEncabezadoPdf(document, page, content, y, fontNormal, fontBold);
            y -= 15;

            y = escribirTituloSeccionPdf(content, "Resumen general", margin, y, fontBold);
            y = dibujarTablaSimplePdf(
                    content,
                    margin,
                    y,
                    new float[]{220, 100},
                    new String[][]{
                            {"Total de investigadores unicos", String.valueOf(totalInvestigadores)},
                            {"Total de participaciones", String.valueOf(datos.size())}
                    },
                    fontNormal,
                    fontBold
            );

            y -= 15;
            y = escribirTituloSeccionPdf(content, "Resumen por proyecto", margin, y, fontBold);

            String[][] proyectosRows;

            if (totalPorProyecto.isEmpty()) {
                proyectosRows = new String[][]{{"No hay datos para mostrar.", ""}};
            } else {
                proyectosRows = totalPorProyecto.entrySet().stream()
                        .limit(10)
                        .map(entry -> new String[]{entry.getKey(), String.valueOf(entry.getValue())})
                        .toArray(String[][]::new);
            }

            y = dibujarTablaConEncabezadoPdf(
                    content,
                    margin,
                    y,
                    new float[]{420, 120},
                    new String[]{"Proyecto", "Cantidad"},
                    proyectosRows,
                    fontNormal,
                    fontBold
            );

            y -= 15;
            y = escribirTituloSeccionPdf(content, "Resumen por rol", margin, y, fontBold);

            String[][] rolesRows;

            if (totalPorRol.isEmpty()) {
                rolesRows = new String[][]{{"No hay datos para mostrar.", ""}};
            } else {
                rolesRows = totalPorRol.entrySet().stream()
                        .map(entry -> new String[]{entry.getKey(), String.valueOf(entry.getValue())})
                        .toArray(String[][]::new);
            }

            y = dibujarTablaConEncabezadoPdf(
                    content,
                    margin,
                    y,
                    new float[]{220, 100},
                    new String[]{"Rol", "Cantidad"},
                    rolesRows,
                    fontNormal,
                    fontBold
            );

            y -= 18;
            y = escribirTituloSeccionPdf(content, "Detalle de investigadores", margin, y, fontBold);

            float[] colWidths = {70, 135, 75, 125, 85, 70, 45, 65, 65};

            String[] headersPdf = {
                    "Codigo",
                    "Proyecto",
                    "Documento",
                    "Investigador",
                    "Grado",
                    "Rol",
                    "Horas",
                    "Inicio",
                    "Fin"
            };

            y = escribirFilaPdf(content, headersPdf, colWidths, margin, y, fontBold, 8);

            for (RepInvestigadoresParticipantesDTO item : datos) {
                if (y < margin + 30) {
                    content.close();

                    page = crearPaginaHorizontal();
                    document.addPage(page);
                    content = new PDPageContentStream(document, page);
                    y = page.getMediaBox().getHeight() - margin;

                    y = dibujarEncabezadoPdf(document, page, content, y, fontNormal, fontBold);
                    y -= 15;

                    y = escribirTituloSeccionPdf(content, "Detalle de investigadores", margin, y, fontBold);
                    y = escribirFilaPdf(content, headersPdf, colWidths, margin, y, fontBold, 8);
                }

                String[] valores = obtenerValoresFilaPdf(item);
                y = escribirFilaPdf(content, valores, colWidths, margin, y, fontNormal, 8);
            }

            content.close();

            document.save(outputStream);
            return outputStream.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Error generando PDF del reporte", e);
        }
    }

    private float dibujarEncabezadoPdf(
            PDDocument document,
            PDPage page,
            PDPageContentStream content,
            float y,
            PDType1Font fontNormal,
            PDType1Font fontBold
    ) throws IOException {
        float pageWidth = page.getMediaBox().getWidth();

        dibujarImagenPdf(document, content, LOGO_CICES, 40, y - 48, 85, 48);
        dibujarImagenPdf(document, content, LOGO_UCR, pageWidth - 125, y - 48, 85, 48);

        float centerX = pageWidth / 2;

        escribirTextoCentradoPdf(content, NOMBRE_SISTEMA, centerX, y, fontBold, 12);
        escribirTextoCentradoPdf(content, NOMBRE_REPORTE, centerX, y - 18, fontBold, 14);
        escribirTextoCentradoPdf(content, "Fecha de creacion: " + obtenerFechaCreacion(), centerX, y - 36, fontNormal, 9);

        content.setStrokingColor(new Color(180, 180, 180));
        content.moveTo(35, y - 58);
        content.lineTo(pageWidth - 35, y - 58);
        content.stroke();

        return y - 75;
    }

    private void dibujarImagenPdf(
            PDDocument document,
            PDPageContentStream content,
            String classpath,
            float x,
            float y,
            float width,
            float height
    ) {
        try {
            ClassPathResource resource = new ClassPathResource(classpath);
            PDImageXObject image = PDImageXObject.createFromByteArray(
                    document,
                    resource.getInputStream().readAllBytes(),
                    classpath
            );
            content.drawImage(image, x, y, width, height);
        } catch (Exception ignored) {
            // Si el logo no existe, el reporte igual se genera.
        }
    }

    private void escribirTextoCentradoPdf(
            PDPageContentStream content,
            String texto,
            float centerX,
            float y,
            PDType1Font font,
            float fontSize
    ) throws IOException {
        String textoPdf = sanitizarPdf(texto);
        float textWidth = font.getStringWidth(textoPdf) / 1000 * fontSize;
        float x = centerX - (textWidth / 2);

        content.beginText();
        content.setFont(font, fontSize);
        content.newLineAtOffset(x, y);
        content.showText(textoPdf);
        content.endText();
    }

    private float escribirTituloSeccionPdf(
            PDPageContentStream content,
            String titulo,
            float x,
            float y,
            PDType1Font fontBold
    ) throws IOException {
        content.setNonStrokingColor(new Color(230, 230, 230));
        content.addRect(x, y - 14, 760, 18);
        content.fill();

        content.setNonStrokingColor(Color.BLACK);
        content.beginText();
        content.setFont(fontBold, 10);
        content.newLineAtOffset(x + 5, y - 10);
        content.showText(sanitizarPdf(titulo));
        content.endText();

        return y - 24;
    }

    private float dibujarTablaSimplePdf(
            PDPageContentStream content,
            float x,
            float y,
            float[] colWidths,
            String[][] rows,
            PDType1Font fontNormal,
            PDType1Font fontBold
    ) throws IOException {
        float rowHeight = 18;
        float currentY = y;

        for (String[] row : rows) {
            float currentX = x;

            for (int i = 0; i < row.length; i++) {
                content.setNonStrokingColor(i == 0 ? new Color(245, 245, 245) : Color.WHITE);
                content.addRect(currentX, currentY - rowHeight, colWidths[i], rowHeight);
                content.fill();

                content.setStrokingColor(new Color(160, 160, 160));
                content.addRect(currentX, currentY - rowHeight, colWidths[i], rowHeight);
                content.stroke();

                content.setNonStrokingColor(Color.BLACK);
                content.beginText();
                content.setFont(i == 0 ? fontBold : fontNormal, 8);
                content.newLineAtOffset(currentX + 4, currentY - 12);
                content.showText(recortar(sanitizarPdf(row[i]), calcularMaxCaracteres(colWidths[i])));
                content.endText();

                currentX += colWidths[i];
            }

            currentY -= rowHeight;
        }

        return currentY;
    }

    private float dibujarTablaConEncabezadoPdf(
            PDPageContentStream content,
            float x,
            float y,
            float[] colWidths,
            String[] headers,
            String[][] rows,
            PDType1Font fontNormal,
            PDType1Font fontBold
    ) throws IOException {
        float rowHeight = 18;
        float currentY = y;
        float currentX = x;

        for (int i = 0; i < headers.length; i++) {
            content.setNonStrokingColor(new Color(217, 234, 247));
            content.addRect(currentX, currentY - rowHeight, colWidths[i], rowHeight);
            content.fill();

            content.setStrokingColor(new Color(160, 160, 160));
            content.addRect(currentX, currentY - rowHeight, colWidths[i], rowHeight);
            content.stroke();

            content.setNonStrokingColor(Color.BLACK);
            content.beginText();
            content.setFont(fontBold, 8);
            content.newLineAtOffset(currentX + 4, currentY - 12);
            content.showText(recortar(sanitizarPdf(headers[i]), calcularMaxCaracteres(colWidths[i])));
            content.endText();

            currentX += colWidths[i];
        }

        currentY -= rowHeight;

        for (String[] row : rows) {
            currentX = x;

            for (int i = 0; i < row.length; i++) {
                content.setNonStrokingColor(Color.WHITE);
                content.addRect(currentX, currentY - rowHeight, colWidths[i], rowHeight);
                content.fill();

                content.setStrokingColor(new Color(160, 160, 160));
                content.addRect(currentX, currentY - rowHeight, colWidths[i], rowHeight);
                content.stroke();

                content.setNonStrokingColor(Color.BLACK);
                content.beginText();
                content.setFont(fontNormal, 8);
                content.newLineAtOffset(currentX + 4, currentY - 12);
                content.showText(recortar(sanitizarPdf(row[i]), calcularMaxCaracteres(colWidths[i])));
                content.endText();

                currentX += colWidths[i];
            }

            currentY -= rowHeight;
        }

        return currentY;
    }

    private PDPage crearPaginaHorizontal() {
        PDRectangle horizontal = new PDRectangle(PDRectangle.A4.getHeight(), PDRectangle.A4.getWidth());
        return new PDPage(horizontal);
    }

    // =========================================================
    // COMUNES
    // =========================================================

    private String[] obtenerHeaders() {
        return new String[]{
                "Código proyecto",
                "Nombre proyecto",
                "Documento identidad",
                "Investigador",
                "Grado académico",
                "Rol en proyecto",
                "Horas asignadas",
                "Fecha inicio participación",
                "Fecha fin participación"
        };
    }

    private String[] obtenerHeadersCortosWord() {
        return new String[]{
                "Código",
                "Proyecto",
                "Documento",
                "Investigador",
                "Grado",
                "Rol",
                "Horas",
                "Inicio",
                "Fin"
        };
    }

    private String[] obtenerValoresFila(RepInvestigadoresParticipantesDTO item) {
        return new String[]{
                valor(item.getCodigoProyecto()),
                valor(item.getNombreProyecto()),
                valor(item.getIdentificacion()),
                valor(item.getNombreInvestigador()),
                valor(item.getGradoAcademico()),
                valor(item.getRolProyecto()),
                obtenerHoras(item),
                item.getFechaInicioParticipacion() != null
                        ? item.getFechaInicioParticipacion().format(DATE_FORMATTER)
                        : "",
                item.getFechaFinParticipacion() != null
                        ? item.getFechaFinParticipacion().format(DATE_FORMATTER)
                        : "Activo"
        };
    }

    private String[] obtenerValoresFilaPdf(RepInvestigadoresParticipantesDTO item) {
        String[] valores = obtenerValoresFila(item);

        for (int i = 0; i < valores.length; i++) {
            valores[i] = sanitizarPdf(valores[i]);
        }

        return valores;
    }

    private String obtenerHoras(RepInvestigadoresParticipantesDTO item) {
        if (item.getHorasAsignadas() != null && item.getHorasAsignadas() > 0) {
            return item.getHorasAsignadas().toString();
        }

        return "No aplica";
    }

    private String valor(String value) {
        return value != null ? value : "";
    }

    private void crearSubtituloWord(XWPFDocument document, String texto) {
        XWPFParagraph paragraph = document.createParagraph();
        paragraph.setSpacingBefore(180);
        paragraph.setSpacingAfter(80);

        XWPFRun run = paragraph.createRun();
        run.setText(texto);
        run.setBold(true);
        run.setFontSize(12);
    }

    private void crearEspacioWord(XWPFDocument document) {
        XWPFParagraph paragraph = document.createParagraph();
        paragraph.createRun().setText("");
    }

    private float escribirFilaPdf(
            PDPageContentStream content,
            String[] valores,
            float[] colWidths,
            float x,
            float y,
            PDType1Font font,
            float fontSize
    ) throws IOException {
        float currentX = x;
        float rowHeight = 18;

        boolean esHeader = valores.length > 0 && "Codigo".equalsIgnoreCase(valores[0]);

        for (int i = 0; i < valores.length; i++) {
            content.setNonStrokingColor(esHeader ? new Color(217, 234, 247) : Color.WHITE);
            content.addRect(currentX, y - rowHeight, colWidths[i], rowHeight);
            content.fill();

            content.setStrokingColor(new Color(160, 160, 160));
            content.addRect(currentX, y - rowHeight, colWidths[i], rowHeight);
            content.stroke();

            String texto = recortar(sanitizarPdf(valores[i]), calcularMaxCaracteres(colWidths[i]));

            content.setNonStrokingColor(Color.BLACK);
            content.beginText();
            content.setFont(font, fontSize);
            content.newLineAtOffset(currentX + 3, y - 12);
            content.showText(texto);
            content.endText();

            currentX += colWidths[i];
        }

        return y - rowHeight;
    }

    private int calcularMaxCaracteres(float width) {
        return Math.max(5, (int) (width / 4.5));
    }

    private String recortar(String texto, int max) {
        if (texto == null) {
            return "";
        }

        if (texto.length() <= max) {
            return texto;
        }

        return texto.substring(0, Math.max(0, max - 3)) + "...";
    }

    private String sanitizarPdf(String texto) {
        if (texto == null) {
            return "";
        }

        return texto
                .replace("\n", " ")
                .replace("\r", " ")
                .replace("\t", " ")
                .replace("á", "a")
                .replace("é", "e")
                .replace("í", "i")
                .replace("ó", "o")
                .replace("ú", "u")
                .replace("Á", "A")
                .replace("É", "E")
                .replace("Í", "I")
                .replace("Ó", "O")
                .replace("Ú", "U")
                .replace("ñ", "n")
                .replace("Ñ", "N")
                .replace("“", "\"")
                .replace("”", "\"")
                .replace("‘", "'")
                .replace("’", "'");
    }
}
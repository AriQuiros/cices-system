package org.example.backend_cices_system.reportes.generator;

import lombok.RequiredArgsConstructor;
import org.docx4j.openpackaging.packages.WordprocessingMLPackage;
import org.docx4j.openpackaging.parts.WordprocessingML.HeaderPart;
import org.docx4j.openpackaging.parts.WordprocessingML.MainDocumentPart;
import org.docx4j.relationships.Relationship;
import org.docx4j.wml.*;
import org.example.backend_cices_system.reportes.builder.WordHeaderBuilder;
import org.example.backend_cices_system.reportes.model.*;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
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

        try {
            WordprocessingMLPackage word = WordprocessingMLPackage.createPackage();
            MainDocumentPart main = word.getMainDocumentPart();

            // =========================
            // HEADER DOCUMENTO
            // =========================
            addHeader(word, doc);

            // =========================
            // CONTENIDO
            // =========================
            for (ReportSection section : doc.sections()) {

                main.addStyledParagraphOfText(
                        "Heading" + section.level(),
                        section.heading()
                );

                for (ReportElement element : section.elements()) {

                    if (element instanceof ReportParagraph(String text)) {
                        main.addParagraphOfText(text);
                    }

                    if (element instanceof ReportTable t) {
                        main.addObject(buildTable(t));
                    }
                }
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            word.save(out);
            return out.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Error generando Word", e);
        }
    }

    // =========================
    // HEADER DOCUMENTO
    // =========================
    private void addHeader(WordprocessingMLPackage word, ReportDocument doc) throws Exception {

        var factory = org.docx4j.jaxb.Context.getWmlObjectFactory();

        HeaderPart headerPart = new HeaderPart();
        headerPart.setPackage(word);

        Hdr hdr = factory.createHdr();

        Tbl table = headerBuilder.buildHeader(doc);

        hdr.getContent().add(table);
        headerPart.setJaxbElement(hdr);

        Relationship rel = word.getMainDocumentPart().addTargetPart(headerPart);

        SectPr sectPr = word.getMainDocumentPart()
                .getJaxbElement()
                .getBody()
                .getSectPr();

        if (sectPr == null) {
            sectPr = factory.createSectPr();
            word.getMainDocumentPart()
                    .getJaxbElement()
                    .getBody()
                    .setSectPr(sectPr);
        }

        HeaderReference headerRef = factory.createHeaderReference();
        headerRef.setId(rel.getId());
        headerRef.setType(HdrFtrRef.DEFAULT);

        sectPr.getEGHdrFtrReferences().add(headerRef);
    }

    // =========================
    // TABLA
    // =========================
    private Tbl buildTable(ReportTable tableData) {

        var factory = org.docx4j.jaxb.Context.getWmlObjectFactory();
        Tbl tbl = factory.createTbl();

        TblPr tblPr = factory.createTblPr();

        // estilo básico Word (importante para estabilidad)
        CTTblPrBase.TblStyle tblStyle = factory.createCTTblPrBaseTblStyle();
        tblStyle.setVal("TableGrid");
        tblPr.setTblStyle(tblStyle);

        tbl.setTblPr(tblPr);

        boolean hasHeader = tableData.headers() != null && !tableData.headers().isEmpty();

        // =========================
        // HEADER ROW
        // =========================
        if (hasHeader) {

            Tr headerRow = factory.createTr();

            for (String h : tableData.headers()) {
                headerRow.getContent().add(createCell(h, true));
            }

            tbl.getContent().add(headerRow);
        }

        // =========================
        // DATA ROWS
        // =========================
        if (tableData.rows() != null) {

            for (List<String> row : tableData.rows()) {

                Tr tr = factory.createTr();

                for (String cell : row) {
                    tr.getContent().add(createCell(cell, false));
                }

                tbl.getContent().add(tr);
            }
        }

        return tbl;
    }

    // =========================
    // CELL
    // =========================
    private Tc createCell(String text, boolean bold) {

        var factory = org.docx4j.jaxb.Context.getWmlObjectFactory();
        Tc tc = factory.createTc();

        P p = factory.createP();
        R r = factory.createR();
        Text t = factory.createText();

        t.setValue(text != null ? text : "");

        if (bold) {
            RPr rpr = factory.createRPr();
            BooleanDefaultTrue b = new BooleanDefaultTrue();
            rpr.setB(b);
            r.setRPr(rpr);
        }

        r.getContent().add(t);
        p.getContent().add(r);
        tc.getContent().add(p);

        return tc;
    }
}
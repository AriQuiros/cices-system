package org.example.backend_cices_system.reportes.builder;

import org.docx4j.jaxb.Context;
import org.docx4j.wml.*;
import org.example.backend_cices_system.reportes.model.ReportDocument;
import org.springframework.stereotype.Component;

import java.math.BigInteger;

@Component
public class WordHeaderBuilder {

    public Tbl buildHeader(ReportDocument doc) {

        ObjectFactory factory = Context.getWmlObjectFactory();
        Tbl table = factory.createTbl();

        // =========================
        // TABLE WIDTH
        // =========================
        TblPr tblPr = factory.createTblPr();

        TblWidth width = new TblWidth();
        width.setType("pct");
        width.setW(BigInteger.valueOf(5000));
        tblPr.setTblW(width);

        // =========================
        // BORDER STYLE
        // =========================
        TblBorders borders = factory.createTblBorders();

        CTBorder border = new CTBorder();
        border.setVal(STBorder.SINGLE);
        border.setSz(BigInteger.valueOf(10));
        border.setColor("000000");

        borders.setTop(border);
        borders.setBottom(border);
        borders.setLeft(border);
        borders.setRight(border);

        tblPr.setTblBorders(borders);
        table.setTblPr(tblPr);

        // =========================
        // ROW
        // =========================
        Tr row = factory.createTr();

        row.getContent().add(createCell("LOGO", JcEnumeration.LEFT));

        row.getContent().add(createTitleCell(
                doc.systemName() + "\n" + doc.title()
        ));

        row.getContent().add(createCell(
                "Creación:\n" + doc.date(),
                JcEnumeration.RIGHT
        ));

        table.getContent().add(row);

        return table;
    }

    // =========================
    // CELL
    // =========================
    private Tc createCell(String text, JcEnumeration align) {

        ObjectFactory factory = Context.getWmlObjectFactory();
        Tc tc = factory.createTc();

        P p = factory.createP();
        R r = factory.createR();
        Text t = factory.createText();

        t.setValue(text != null ? text : "");

        r.getContent().add(t);
        p.getContent().add(r);

        PPr ppr = factory.createPPr();
        Jc jc = factory.createJc();
        jc.setVal(align);
        ppr.setJc(jc);

        p.setPPr(ppr);
        tc.getContent().add(p);

        return tc;
    }

    // =========================
    // TITLE CELL
    // =========================
    private Tc createTitleCell(String text) {

        ObjectFactory factory = Context.getWmlObjectFactory();
        Tc tc = factory.createTc();

        P p = factory.createP();

        PPr ppr = factory.createPPr();

        PPrBase.PStyle style = factory.createPPrBasePStyle();
        style.setVal("Title");
        ppr.setPStyle(style);

        Jc jc = factory.createJc();
        jc.setVal(JcEnumeration.CENTER);
        ppr.setJc(jc);

        p.setPPr(ppr);

        R r = factory.createR();
        Text t = factory.createText();
        t.setValue(text != null ? text : "");


        /*RPr rpr = factory.createRPr();
        // tamaño (en half-points)
        HpsMeasure size = new HpsMeasure();
        size.setVal(BigInteger.valueOf(36)); // 36 = 18pt

        rpr.setSz(size);

        // (opcional) también para compatibilidad
        rpr.setSzCs(size);

        r.setRPr(rpr);*/

        r.getContent().add(t);
        p.getContent().add(r);

        tc.getContent().add(p);

        return tc;
    }
}
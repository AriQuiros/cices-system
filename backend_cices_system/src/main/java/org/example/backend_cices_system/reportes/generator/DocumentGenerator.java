package org.example.backend_cices_system.reportes.generator;

import org.example.backend_cices_system.reportes.model.DocumentFormat;
import org.example.backend_cices_system.reportes.model.ReportDocument;

public interface DocumentGenerator {

    DocumentFormat getFormat();

    byte[] generate(ReportDocument document);
}
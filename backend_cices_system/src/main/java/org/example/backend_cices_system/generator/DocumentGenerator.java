package org.example.backend_cices_system.generator;

import org.example.backend_cices_system.model.export.DocumentFormat;
import org.example.backend_cices_system.model.export.ReportDocument;

public interface DocumentGenerator {

    DocumentFormat getFormat();

    byte[] generate(ReportDocument document);
}
package org.example.backend_cices_system.export.generator;

import org.example.backend_cices_system.export.model.DocumentFormat;
import org.example.backend_cices_system.export.model.ReportDocument;

public interface DocumentGenerator {

    DocumentFormat getFormat();

    byte[] generate(ReportDocument document);
}
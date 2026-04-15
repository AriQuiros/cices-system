package org.example.backend_cices_system.reportes.builder;

import org.example.backend_cices_system.reportes.model.ReportDocument;

public interface ReportBuilder<T> {
    ReportDocument build(T data);
}
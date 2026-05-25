package org.example.backend_cices_system.builder;

import org.example.backend_cices_system.model.export.ReportDocument;

public interface ReportBuilder<T> {
    ReportDocument build(T data);
}
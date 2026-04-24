package org.example.backend_cices_system.export.builder;

import org.example.backend_cices_system.export.model.ReportDocument;

public interface ReportBuilder<T> {
    ReportDocument build(T data);
}
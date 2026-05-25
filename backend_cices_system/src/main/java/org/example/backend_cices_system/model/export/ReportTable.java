package org.example.backend_cices_system.model.export;

import java.util.List;

public record ReportTable(
        List<String> headers,
        List<List<String>> rows
) implements ReportElement {
}
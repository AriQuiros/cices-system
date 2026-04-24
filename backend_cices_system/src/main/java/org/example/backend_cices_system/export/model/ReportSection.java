package org.example.backend_cices_system.export.model;

import java.util.List;

public record ReportSection(
        String heading,
        int level,
        List<ReportElement> elements
) {}
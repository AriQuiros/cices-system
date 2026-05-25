package org.example.backend_cices_system.model.export;

import java.util.List;

public record ReportSection(
        String heading,
        int level,
        List<ReportElement> elements
) {}
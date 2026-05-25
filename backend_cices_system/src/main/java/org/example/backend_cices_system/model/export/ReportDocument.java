package org.example.backend_cices_system.model.export;

import java.time.LocalDate;
import java.util.List;

public record ReportDocument(
        String title,
        String systemName,
        LocalDate date,
        List<ReportSection> sections
) {}
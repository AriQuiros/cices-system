package org.example.backend_cices_system.export.model;

public record ReportParagraph(
        String text,
        boolean bold
) implements ReportElement {
}
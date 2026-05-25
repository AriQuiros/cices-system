package org.example.backend_cices_system.model.export;

public record ReportParagraph(
        String text,
        boolean bold
) implements ReportElement {
}
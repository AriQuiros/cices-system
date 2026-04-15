package org.example.backend_cices_system.reportes.model;

public enum DocumentFormat {
    PDF,
    WORD,
    EXCEL;

    public static DocumentFormat from(String value) {
        return switch (value.toLowerCase()) {
            case "pdf" -> PDF;
            case "docx", "word" -> WORD;
            case "xlsx", "excel" -> EXCEL;
            default -> throw new IllegalArgumentException("Formato no soportado: " + value);
        };
    }
}

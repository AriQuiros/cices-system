package org.example.backend_cices_system.export.service;

import org.example.backend_cices_system.export.builder.ReportBuilder;
import org.example.backend_cices_system.export.generator.DocumentGenerator;
import org.example.backend_cices_system.export.generator.DocumentGeneratorRegistry;
import org.example.backend_cices_system.export.model.DocumentFormat;
import org.example.backend_cices_system.export.model.ReportDocument;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;


@Service
public class DocumentService {

    private final DocumentGeneratorRegistry registry;
    // luego agregas certificacionesBuilder, etc.

    public DocumentService(
            DocumentGeneratorRegistry registry
    ) {
        this.registry = registry;
    }

    public <T> ResponseEntity<byte[]> generarResponse(
            ReportBuilder<T> builder,
            T data,
            String formato,
            String nombreArchivoBase
    ) {

        // 1. Generar archivo
        byte[] archivo = generar(builder, data, formato);

        // 2. Resolver formato
        DocumentFormat format = DocumentFormat.from(formato);

        // 3. Nombre final
        String filename = nombreArchivoBase + "." + getExtension(format);

        // 4. Content-Type correcto
        MediaType contentType = getContentType(format);

        // 5. ResponseEntity listo
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + filename + "\"")
                .contentType(contentType)
                .body(archivo);
    }

    // -----------------------------
    // MÉTODO BASE
    // -----------------------------
    public <T> byte[] generar(
            ReportBuilder<T> builder,
            T data,
            String formato
    ) {
        ReportDocument doc = builder.build(data);
        DocumentFormat format = DocumentFormat.from(formato);
        DocumentGenerator generator = registry.forFormat(format);
        return generator.generate(doc);
    }

    // -----------------------------
    // CONTENT TYPE
    // -----------------------------
    private MediaType getContentType(DocumentFormat format) {
        return switch (format) {
            case PDF -> MediaType.APPLICATION_PDF;

            case WORD -> MediaType.parseMediaType(
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            );

            case EXCEL -> MediaType.parseMediaType(
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
        };
    }
    // -----------------------------
    // EXTENSION
    // -----------------------------
    private String getExtension(DocumentFormat format) {
        return switch (format) {
            case PDF -> "pdf";
            case WORD -> "docx";
            case EXCEL -> "xlsx";
        };
    }
}
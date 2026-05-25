package org.example.backend_cices_system.generator;

import org.example.backend_cices_system.model.export.DocumentFormat;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class DocumentGeneratorRegistry {

    private final Map<DocumentFormat, DocumentGenerator> generators;

    public DocumentGeneratorRegistry(List<DocumentGenerator> generators) {

        this.generators = generators.stream()
                .collect(Collectors.toMap(
                        DocumentGenerator::getFormat,
                        g -> g
                ));
    }

    public DocumentGenerator forFormat(DocumentFormat format) {

        DocumentGenerator generator = generators.get(format);

        if (generator == null) {
            throw new IllegalArgumentException("Formato no soportado: " + format);
        }

        return generator;
    }
}
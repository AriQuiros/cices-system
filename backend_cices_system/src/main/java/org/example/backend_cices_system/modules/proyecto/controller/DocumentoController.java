package org.example.backend_cices_system.modules.proyecto.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.modules.proyecto.model.Documento;
import org.example.backend_cices_system.modules.proyecto.repository.DocumentoRepository;
import org.example.backend_cices_system.modules.proyecto.service.DocumentoService;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/documentos")
@RequiredArgsConstructor
public class DocumentoController {

    private final DocumentoService service;

    @GetMapping("/{id}/descargar")
    public ResponseEntity<Resource> descargar(@PathVariable Integer id) {
        return servirArchivo(id, false);
    }


    @GetMapping("/{id}/visualizar")
    public ResponseEntity<Resource> visualizar(@PathVariable Integer id) {
        return servirArchivo(id, true);
    }

    // ── Lógica compartida ─────────────────────────────────────────────────

    private ResponseEntity<Resource> servirArchivo(Integer id, boolean inline) {
        var doc = service.obtenerPorId(id);

        Path ruta = Paths.get(doc.getDirectorio()).toAbsolutePath().normalize();

        Resource recurso;
        try {
            recurso = new UrlResource(ruta.toUri());
        } catch (MalformedURLException e) {
            throw new RuntimeException("Ruta de archivo inválida: " + ruta, e);
        }

        if (!recurso.exists() || !recurso.isReadable()) {
            throw new RuntimeException("Archivo no encontrado en el servidor: " + ruta);
        }

        String contentDisposition = inline
                ? "inline; filename=\"" + doc.getNombreDocumento() + "\""
                : "attachment; filename=\"" + doc.getNombreDocumento() + "\"";

        MediaType mediaType = resolverMediaType(doc.getNombreDocumento());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition)
                .contentType(mediaType)
                .body(recurso);
    }

    private MediaType resolverMediaType(String nombreArchivo) {
        if (nombreArchivo == null) return MediaType.APPLICATION_OCTET_STREAM;
        String nombre = nombreArchivo.toLowerCase();
        if (nombre.endsWith(".pdf"))  return MediaType.APPLICATION_PDF;
        if (nombre.endsWith(".png"))  return MediaType.IMAGE_PNG;
        if (nombre.endsWith(".jpg") || nombre.endsWith(".jpeg")) return MediaType.IMAGE_JPEG;
        if (nombre.endsWith(".txt"))  return MediaType.TEXT_PLAIN;
        return MediaType.APPLICATION_OCTET_STREAM;
    }
}

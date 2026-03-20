package org.example.backend_cices_system.service;

import org.example.backend_cices_system.data.DocumentoRepository;
import org.example.backend_cices_system.dto.DocumentoDTO;
import org.example.backend_cices_system.logic.Documento;
import org.example.backend_cices_system.logic.Proyecto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;

@Service
public class DocumentoService {
    @Autowired
    private DocumentoRepository documentoRepo;
    private final String basePath = "proyectos";

    public void guardarDocumentos(Proyecto proyecto, List<MultipartFile> documentos) {
        if (documentos == null || documentos.isEmpty()) return;

        String proyectoFolder = basePath + "/" + proyecto.getCodigoProyecto();
        File carpetaProyecto = new File(proyectoFolder);
        if (!carpetaProyecto.exists()) carpetaProyecto.mkdirs();

        for (MultipartFile archivo : documentos) {
            try {
                Path rutaArchivo = Paths.get(proyectoFolder, archivo.getOriginalFilename());
                Files.copy(archivo.getInputStream(), rutaArchivo, StandardCopyOption.REPLACE_EXISTING);

                Documento doc = new Documento();
                doc.setNombreDocumento(archivo.getOriginalFilename());
                doc.setDirectorio(rutaArchivo.toString());
                doc.setIdProyecto(proyecto);
                documentoRepo.save(doc);

            } catch (IOException e) {
                throw new RuntimeException("Error guardando documento: " + archivo.getOriginalFilename(), e);
            }
        }
    }

    public DocumentoDTO obtenerDTO (Documento documento){
        return new DocumentoDTO(documento.getId(),documento.getNombreDocumento(),documento.getDirectorio());
    }

    public List<DocumentoDTO> documentoDTOList(Proyecto proyecto){
        return documentoRepo.findDocumentoByIdProyecto(proyecto).stream()
                .map(this::obtenerDTO).toList();
    }
}

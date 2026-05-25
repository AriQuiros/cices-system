package org.example.backend_cices_system.service.entity;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.repository.entity.DocumentoRepository;
import org.example.backend_cices_system.dto.entity.DocumentoDTO;
import org.example.backend_cices_system.model.entity.Documento;
import org.example.backend_cices_system.model.entity.Proyecto;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DocumentoService {
    private final DocumentoRepository documentoRepo;
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

    public List<DocumentoDTO> documentosPorIdProyecto(Integer idProyecto){
        return documentoRepo.findDocumentoByIdProyecto_Id(idProyecto).stream()
                .map(this::obtenerDTO).toList();
    }

    public Documento obtenerPorId(Integer id){
        return documentoRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Documento no encontrado: " + id));
    }

    public Map<Integer, List<DocumentoDTO>> obtenerPorProyectos(List<Integer> idsProyectos) {

        List<Documento> documentos = documentoRepo.findByIdProyecto_IdIn(idsProyectos);

        return documentos.stream()
                .collect(Collectors.groupingBy(
                        doc -> doc.getIdProyecto().getId(),
                        Collectors.mapping(
                                this::obtenerDTO,
                                Collectors.toList()
                        )
                ));
    }
}

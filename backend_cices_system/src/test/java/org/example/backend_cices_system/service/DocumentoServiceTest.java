package org.example.backend_cices_system.service;
import org.example.backend_cices_system.logic.Documento;
import org.example.backend_cices_system.logic.Proyecto;
import org.example.backend_cices_system.data.DocumentoRepository;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.InjectMocks;
import org.mockito.MockitoAnnotations;
import org.mockito.ArgumentCaptor;

import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class DocumentoServiceTest {

    @Mock
    private DocumentoRepository documentoRepo;

    @InjectMocks
    private DocumentoService documentoService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void guardarDocumentos_listaNull() {
        documentoService.guardarDocumentos(new Proyecto(), null);

        verifyNoInteractions(documentoRepo);
    }

    @Test
    void guardarDocumentos_listaVacia() {
        documentoService.guardarDocumentos(new Proyecto(), List.of());

        verifyNoInteractions(documentoRepo);
    }

    private final String basePath = "proyectos";

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @AfterEach
    void cleanup() throws Exception {
        Path proyectoFolder = Path.of(basePath, "PROY001");
        if (Files.exists(proyectoFolder)) {
            Files.walk(proyectoFolder)
                    .map(Path::toFile)
                    .sorted((o1, o2) -> -o1.compareTo(o2))
                    .forEach(File::delete);
        }
    }

    @Test
    void guardarDocumentos_variosArchivos_reales_creaArchivosYRegistros() throws Exception {
        Proyecto proyecto = new Proyecto();
        proyecto.setCodigoProyecto("PROY001");

        List<MultipartFile> archivos = List.of(
                new MockMultipartFile("txt", "archivo.txt", "text/plain", "contenido txt".getBytes()),
                new MockMultipartFile("pdf", "documento.pdf", "application/pdf", new byte[]{0x25, 0x50, 0x44, 0x46}),
                new MockMultipartFile("docx", "archivo.docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", new byte[]{0x50, 0x4B, 0x03, 0x04}),
                new MockMultipartFile("csv", "datos.csv", "text/csv", "col1,col2\nval1,val2".getBytes()),
                new MockMultipartFile("xlsx", "datos.xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", new byte[]{0x50, 0x4B, 0x03, 0x04}),
                new MockMultipartFile("exe", "programa.exe", "application/octet-stream", new byte[]{0x4D, 0x5A}),
                new MockMultipartFile("png", "imagen.png", "image/png", new byte[]{(byte)0x89, 0x50, 0x4E, 0x47})
        );

        documentoService.guardarDocumentos(proyecto, archivos);

        // Verificar que se hayan guardado los documentos en el repo
        ArgumentCaptor<Documento> captor = ArgumentCaptor.forClass(Documento.class);
        verify(documentoRepo, times(7)).save(captor.capture());

        List<Documento> documentosGuardados = captor.getAllValues();

        // Validar propiedades básicas de los documentos guardados
        for (int i = 0; i < documentosGuardados.size(); i++) {
            Documento doc = documentosGuardados.get(i);
            assertEquals(archivos.get(i).getOriginalFilename(), doc.getNombreDocumento());
            assertEquals(proyecto, doc.getIdProyecto());
            assertTrue(doc.getDirectorio().contains(proyecto.getCodigoProyecto()));

            // También verificar que el archivo exista realmente en disco
            File archivoGuardado = new File(doc.getDirectorio());
            assertTrue(archivoGuardado.exists());
            assertTrue(archivoGuardado.isFile());
            assertTrue(archivoGuardado.length() > 0);
        }
    }

    @Test
    void guardarDocumentos_errorAlGuardarLanzaRuntimeException() throws IOException {
        Proyecto proyecto = new Proyecto();
        proyecto.setCodigoProyecto("PR002");

        MultipartFile archivo = mock(MultipartFile.class);

        when(archivo.getOriginalFilename()).thenReturn("archivoFallido.txt");
        when(archivo.getInputStream()).thenThrow(new IOException("Error simulada"));

        RuntimeException thrown = assertThrows(RuntimeException.class,
                () -> documentoService.guardarDocumentos(proyecto, List.of(archivo)));

        assertTrue(thrown.getMessage().contains("Error guardando documento"));
        verify(documentoRepo, never()).save(any());
    }
}


package org.example.backend_cices_system.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DocumentoDTO {
    private Short idDocumento;
    private String nombreDocumento;
    private String directorio;

    public DocumentoDTO() {
    }

    public DocumentoDTO(Short idDocumento, String nombreDocumento, String directorio) {
        this.idDocumento = idDocumento;
        this.nombreDocumento = nombreDocumento;
        this.directorio = directorio;
    }
}

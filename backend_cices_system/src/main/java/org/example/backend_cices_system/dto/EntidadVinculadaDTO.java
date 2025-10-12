package org.example.backend_cices_system.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EntidadVinculadaDTO {
    private Short idEntidad;
    private String nombre;
    private String tipo; // INSTITUCION, UNIDAD, SITIO

    public EntidadVinculadaDTO() {
    }

    public EntidadVinculadaDTO(String nombre, String tipo) {
        this.nombre = nombre;
        this.tipo = tipo;
    }
}


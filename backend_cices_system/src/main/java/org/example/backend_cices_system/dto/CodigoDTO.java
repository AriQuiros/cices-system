package org.example.backend_cices_system.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CodigoDTO {
    private Short id;
    private String despliegue;
    private String valor;

    public CodigoDTO(Short id, String despliegue, String valor) {
        this.id = id;
        this.despliegue = despliegue;
        this.valor = valor;
    }

}

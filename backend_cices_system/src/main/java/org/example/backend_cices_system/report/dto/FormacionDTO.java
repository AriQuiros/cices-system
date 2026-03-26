package org.example.backend_cices_system.report.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class FormacionDTO {

    private String identificacionInvestigador;
    private String nombreInvestigador;
    private String nombre;
    private String institucion;
    private String tipo;
    private String estado;
    private LocalDate fecha;

    public FormacionDTO(
            String identificacionInvestigador,
            String nombreInvestigador,
            String nombre,
            String institucion,
            String tipo,
            String estado,
            LocalDate fecha
    ) {
        this.identificacionInvestigador = identificacionInvestigador;
        this.nombreInvestigador         = nombreInvestigador;
        this.nombre                     = nombre;
        this.institucion                = institucion;
        this.tipo                       = tipo;
        this.estado                     = estado;
        this.fecha                      = fecha;
    }

}

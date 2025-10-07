package org.example.backend_cices_system.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
@Getter
@Setter
public class PresupuestoDTO {
    private Short idProyecto;
    private LocalDate fechaAsignacion;
    private Short idCodigoFuenteFinanciamiento;
    private BigDecimal monto;
    private Double cantidadHorasMes;
    private Short cantidadMeses;
    private Short idCodigoTipoPresupuesto;
    private String descripcion;

}

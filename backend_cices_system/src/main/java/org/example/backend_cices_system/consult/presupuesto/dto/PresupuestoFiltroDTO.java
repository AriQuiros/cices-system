package org.example.backend_cices_system.consult.presupuesto.dto;

import java.time.LocalDate;
import java.util.List;

public record PresupuestoFiltroDTO(
        String codigoProyecto,
        String busqueda,
        String tipoPresupuesto,
        List<String> fuentesFinanciamiento,
        List<String> categorias,
        LocalDate fechaDesde,
        LocalDate fechaHasta
) {}

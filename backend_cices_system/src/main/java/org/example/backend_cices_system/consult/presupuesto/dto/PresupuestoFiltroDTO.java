package org.example.backend_cices_system.consult.presupuesto.dto;

import java.util.List;

public record PresupuestoFiltroDTO(
        String codigoProyecto,
        String busqueda,
        String tipoPresupuesto,
        List<String> fuentesFinanciamiento,
        List<String> categorias,
        Integer anioDesde,
        Integer anioHasta
) {}

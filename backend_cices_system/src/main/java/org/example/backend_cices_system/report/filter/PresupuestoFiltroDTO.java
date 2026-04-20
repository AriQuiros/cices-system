package org.example.backend_cices_system.report.filter;

import java.util.List;

public record PresupuestoFiltroDTO(
        String busqueda,
        List<String> tiposPresupuesto,
        List<String> fuentesFinanciamiento,
        List<String> categorias
) {}

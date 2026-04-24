package org.example.backend_cices_system.consult.presupuesto.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.consult.presupuesto.dto.PresupuestoDatosDTO;
import org.example.backend_cices_system.consult.presupuesto.dto.PresupuestoFiltroDTO;
import org.example.backend_cices_system.consult.presupuesto.service.RepPresupuestoBaseService;
import org.example.backend_cices_system.export.dto.PresupuestoReporteDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/consulta/presupuestos")
public class RepPresupuestoBaseController {

    private final RepPresupuestoBaseService service;

    @GetMapping("/{idPresupuesto}") // presupuesto completo
    public PresupuestoReporteDTO obtenerPorId(@PathVariable Integer idPresupuesto) {

        return service.obtenerPresupuestoReporteDTOPorIdPresupuesto(idPresupuesto); // completo sin gastos u horas
    }

    @GetMapping("/busqueda") // lista ligera
    public List<PresupuestoDatosDTO> listadoPresupuestosTipo(
            @ModelAttribute PresupuestoFiltroDTO filtro, // con codigoProyecto, tipo y busqueda (categoria o descripción)
            @PageableDefault(size = 8, page = 0) Pageable pageable // primeros 8 resultados
    ) {

        return service.buscarPresupuestosBase(filtro,null, null, pageable) // id, categoria y descripcion
                .stream().map(service::obtenerPresupuestoDatosDTO).toList();
    }

    @GetMapping("/tipo/proyecto") // presupuestos completos por proyecto -> paginado con lista (10) de gasto u horas
    public Page<PresupuestoReporteDTO> PresupuestosPorProyectoPorTipo(
            @ModelAttribute PresupuestoFiltroDTO filtro,
            @RequestParam(required = false) String ordenarPorPresupuesto,
            @RequestParam(required = false) String direccionPresupuesto,
            @RequestParam(required = false) String ordenarPorGasto,
            @RequestParam(required = false) String direccionGasto,
            @PageableDefault(size = 3, page = 0) Pageable pageable
    ) {
        return service.consultaPorProyectoYTipo(
                filtro, ordenarPorPresupuesto, direccionPresupuesto,
                ordenarPorGasto, direccionGasto, pageable);
    }

    @GetMapping("/proyecto") // presupuestos por proyecto sin gasto ni horas -> paginado
    public Page<PresupuestoReporteDTO> PresupuestosPorProyecto(
            @ModelAttribute PresupuestoFiltroDTO filtro,
            @RequestParam(required = false) String ordenarPorPresupuesto,
            @RequestParam(required = false) String direccionPresupuesto,
            @PageableDefault(size = 3, page = 0) Pageable pageable
    ) {
        return service.buscarPresupuestosBase(
                filtro, ordenarPorPresupuesto, direccionPresupuesto, pageable)
                .map(p -> service.obtenerPresupuestoReporteDTO(p, null, null));
    }

}

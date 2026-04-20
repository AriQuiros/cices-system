package org.example.backend_cices_system.report.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.dto.ProyectoDatosDTO;
import org.example.backend_cices_system.dto.ProyectoFechasDTO;
import org.example.backend_cices_system.report.filter.ProyectoFiltroDTO;
import org.example.backend_cices_system.report.serviceVw.ProyectoReporteOrquestador;
import org.example.backend_cices_system.report.serviceVw.RepProyectoBaseService;
import org.example.backend_cices_system.reportes.dto.ProyectoReporteDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/consulta/proyectos")
public class RepProyectoBaseController {

    private final RepProyectoBaseService service;
    private final ProyectoReporteOrquestador orquestador;

    @GetMapping("/codigo-nombre-fechas")
    public Page<ProyectoFechasDTO> obtenerProyectos_CodigoNombre(@RequestParam(required = false) String texto,
                                                                 @PageableDefault(size = 8, page = 0) Pageable pageable) {
        var filtro = new ProyectoFiltroDTO(texto, null, null, null, null);
        return service.obtenerProyectosFechasDTOs(filtro, pageable);
    }

    @GetMapping("/listar")
    public Page<ProyectoDatosDTO> listar(
            ProyectoFiltroDTO filtro,
            @PageableDefault(size = 8, page = 0) Pageable pageable
    ) {
        return service.buscarConFiltros(
                filtro,
                pageable
        );
    }

    @GetMapping("/{idProyecto}")
    public ProyectoReporteDTO obtenerProyecto(@PathVariable Integer idProyecto) {
        return orquestador.ensamblarUnoOptimizado(idProyecto);
    }

}

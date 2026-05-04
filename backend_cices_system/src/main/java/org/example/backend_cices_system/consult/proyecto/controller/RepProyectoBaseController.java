package org.example.backend_cices_system.consult.proyecto.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.modules.proyecto.dto.ProyectoDatosDTO;
import org.example.backend_cices_system.modules.proyecto.dto.ProyectoFechasDTO;
import org.example.backend_cices_system.consult.proyecto.dto.ProyectoFiltroDTO;
import org.example.backend_cices_system.export.service.ProyectoReporteOrquestador;
import org.example.backend_cices_system.consult.proyecto.service.RepProyectoBaseService;
import org.example.backend_cices_system.export.dto.ProyectoReporteDTO;
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

    @GetMapping("/busqueda")
    public List<ProyectoFechasDTO> obtenerProyectos_CodigoNombre(@RequestParam(required = false) String texto,
                                                                 @PageableDefault(size = 5, page = 0) Pageable pageable) {
        var filtro = new ProyectoFiltroDTO(texto, null, null, null, null);
        return service.obtenerProyectosFechasDTOs(filtro, pageable);
    }

    @GetMapping("/listar")
    public Page<ProyectoDatosDTO> listar(
            @ModelAttribute ProyectoFiltroDTO filtro,
            @PageableDefault(size = 8, page = 0) Pageable pageable
    ) {
        return service.buscarConFiltros(
                filtro,
                pageable
        );
    }

    @GetMapping("/{codigoProyecto}")
    public ProyectoReporteDTO obtenerProyecto(@PathVariable String codigoProyecto) {
        return orquestador.ensamblarUnoOptimizado(codigoProyecto);
    }

}

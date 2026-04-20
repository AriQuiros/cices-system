package org.example.backend_cices_system.report.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.report.dto.PresupuestoDatosDTO;
import org.example.backend_cices_system.report.serviceVw.RepPresupuestoBaseService;
import org.example.backend_cices_system.reportes.dto.PresupuestoReporteDTO;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/consulta/presupuestos")
public class RepPresupuestoBaseController {

    private final RepPresupuestoBaseService service;

    @GetMapping("/{idPresupuesto}")
    public PresupuestoReporteDTO obtenerPorId(@PathVariable Integer idPresupuesto) {

        var presupuesto = service.obtenerPorIdPresupuesto(idPresupuesto);

        return service.obtenerPresupuestoReporteDTO(presupuesto, null, null);
    }

    @GetMapping("/tipo?{tipoPresupuesto}/listado/{codigoProyecto}")
    public List<PresupuestoDatosDTO> listadoHoras(@PathVariable String codigoProyecto,
                                                  @PathVariable String tipoPresupuesto) {
        return service.presupuestoPorTipoYCodigoProyecto(codigoProyecto, tipoPresupuesto)
                .stream().map(service::obtenerPresupuestoDatosDTO)
                .toList();
    }

    @GetMapping("/horas/{codigoProyecto}")
    public List<PresupuestoReporteDTO> horasPorProyecto(
            @PathVariable String codigoProyecto
    ) {
        return service.consultaHorasPorCodigoProyecto(codigoProyecto);
    }

    @GetMapping("/financieros/{codigoProyecto}")
    public List<PresupuestoReporteDTO> financierosPorProyecto(
            @PathVariable String codigoProyecto
    ) {
        return service.consultaFinancieroPorCodigoProyecto(codigoProyecto);
    }
}

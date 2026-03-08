package org.example.backend_cices_system.service;

import org.example.backend_cices_system.data.HorasAsignadasRepository;
import org.example.backend_cices_system.dto.HorasAsignadasDTO;
import org.example.backend_cices_system.logic.*;
import org.springframework.stereotype.Service;


@Service
public class HorasAsignadasService {
    private final HorasAsignadasRepository horasAsignadasRepository;
    private final PresupuestoService presupuestoService;
    private final CatalogoService catalogoService;

    public HorasAsignadasService(HorasAsignadasRepository horasAsignadasRepository, CatalogoService catalogoService,
                                 PresupuestoService presupuestoService) {
        this.catalogoService = catalogoService;
        this.horasAsignadasRepository = horasAsignadasRepository;
        this.presupuestoService = presupuestoService;
    }

    public HorasAsignada guardarHorasAsignadas(HorasAsignadasDTO horasDTO, InvestigadorProyecto investigadorProyecto) {
        var horasAsignadas = new HorasAsignada();
        Presupuesto presupuesto = presupuestoService.buscarPresupuestoHorasXProyecto(investigadorProyecto.getIdProyecto(), horasDTO.presupuesto().descripcion());
        horasAsignadas.setIdPresupuesto(presupuesto);
        horasAsignadas.setIdInvestigadorProyecto(investigadorProyecto);
        horasAsignadas.setIdCodigoTipoModalidad(catalogoService.codigoXNombreValor("MODALIDAD_HORARIA", horasDTO.modalidad()));
        horasAsignadas.setCantidadHorasMes(horasDTO.cantidadHorasMes());
        horasAsignadas.setCantidadMeses(horasDTO.cantidadMeses());

        horasAsignadasRepository.save(horasAsignadas);

        return horasAsignadas;
    }


}

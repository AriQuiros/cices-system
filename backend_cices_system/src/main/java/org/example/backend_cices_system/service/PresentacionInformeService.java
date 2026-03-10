package org.example.backend_cices_system.service;

import org.example.backend_cices_system.data.PresentacionInformeRepository;
import org.example.backend_cices_system.dto.InformeDTO;
import org.example.backend_cices_system.logic.PresentacionInforme;
import org.example.backend_cices_system.logic.Proyecto;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class PresentacionInformeService {
    private final PresentacionInformeRepository presentacionInformeRepository;
    private final CatalogoService catalogoService;

    public PresentacionInformeService(PresentacionInformeRepository presentacionInformeRepository, CatalogoService catalogoService) {
        this.catalogoService = catalogoService;
        this.presentacionInformeRepository = presentacionInformeRepository;
    }

    public void guardarPresentacionInforme(InformeDTO informe, Proyecto proyecto) {
        var presentacionInforme = new PresentacionInforme();
        presentacionInforme.setIdProyecto(proyecto);
        presentacionInforme.setFechaPresentacion(informe.fechaPresentacion());
        presentacionInforme.setIdCodigoTipoInforme(informe.tipoInforme().id());
        Short codigoEstadoInforme = obtenerCodigoEstadoInforme(informe.fechaPresentacion());
        presentacionInforme.setIdCodigoTipoEstado(codigoEstadoInforme);

        presentacionInformeRepository.save(presentacionInforme);
    }

    public Short obtenerCodigoEstadoInforme(LocalDate fechaPresentacion) {
        var fechaActual = LocalDate.now();
        boolean entregado = fechaPresentacion.isAfter(fechaActual);
        if (!entregado)
            return catalogoService.codigoXNombreValor("ESTADO_INFORME", "PENDIENTE");
        else
            return catalogoService.codigoXNombreValor("ESTADO_INFORME", "ENTREGADO");
    }
}

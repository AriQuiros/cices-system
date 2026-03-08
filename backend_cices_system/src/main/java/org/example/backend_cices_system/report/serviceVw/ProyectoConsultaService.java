package org.example.backend_cices_system.report.serviceVw;

import org.example.backend_cices_system.report.dao.*;
import org.example.backend_cices_system.report.view.RepProyectoBase;
import org.springframework.stereotype.Service;

import java.util.Map;

/**
 * @author angie
 */
@Service
public class ProyectoConsultaService {

    private final RepProyectoBaseRepository proyectoBaseRepo;
    private final RepEntidadProyectoRepository entidadProyectoRepo;
    private final RepInvestigadorProyectoRepository investigadorRepo;
    private final RepProyectoResultadosRepository resultadosRepo;
    private final RepProyectoDocumentoRepository documentosRepo;
    private final RepProyectoPresentacionInformeRepository informesRepo;

    public ProyectoConsultaService(
            RepProyectoBaseRepository proyectoBaseRepo,
            RepEntidadProyectoRepository entidadProyectoRepo,
            RepInvestigadorProyectoRepository investigadorRepo,
            RepProyectoResultadosRepository resultadosRepo,
            RepProyectoDocumentoRepository documentosRepo,
            RepProyectoPresentacionInformeRepository informesRepo
    ) {
        this.proyectoBaseRepo = proyectoBaseRepo;
        this.entidadProyectoRepo = entidadProyectoRepo;
        this.investigadorRepo = investigadorRepo;
        this.resultadosRepo = resultadosRepo;
        this.documentosRepo = documentosRepo;
        this.informesRepo = informesRepo;
    }

    public RepProyectoBase obtenerProyectoBasico(String codigoProyecto) {
        return proyectoBaseRepo.findByCodigoProyecto(codigoProyecto);
    }

    public Map<String, Object> obtenerProyectoCompleto(String codigoProyecto) {
        return Map.of(
                "proyecto", proyectoBaseRepo.findByCodigoProyecto(codigoProyecto),
                "entidades", entidadProyectoRepo.findByCodigoProyecto(codigoProyecto),
                "investigadores", investigadorRepo.findByCodigoProyecto(codigoProyecto),
                "resultados", resultadosRepo.findByCodigoProyecto(codigoProyecto),
                "documentos", documentosRepo.findByCodigoProyecto(codigoProyecto),
                "informes", informesRepo.findByCodigoProyecto(codigoProyecto)
        );
    }
}


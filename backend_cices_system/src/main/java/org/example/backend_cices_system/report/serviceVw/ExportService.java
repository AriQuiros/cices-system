package org.example.backend_cices_system.report.serviceVw;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.data.audit.PresupuestoBitRepository;
import org.example.backend_cices_system.report.dao.*;
import org.example.backend_cices_system.report.view.RepProyectoBase;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class ExportService {

    private final RepProyectoBaseRepository proyectoBaseRepo;
    private final RepEntidadProyectoRepository entidadProyectoRepo;
    private final RepInvestigadorProyectoRepository investigadorRepo;
    private final RepProyectoResultadosRepository resultadosRepo;
    private final RepProyectoDocumentoRepository documentosRepo;
    private final RepProyectoPresentacionInformeRepository informesRepo;

    private final RepPresupuestoBaseRepository presupuestoBaseRepo;
    private final PresupuestoBitRepository presupuestoBitRepository;
    private final RepPresupuestoGastosRepository gastosRepo;
    private final RepPresupuestoHorasRepository horasRepo;

    public Map<String, Object> exportarProyectoAcademico(String codigoProyecto) {
        return Map.of(
                "proyecto", proyectoBaseRepo.findByCodigoProyecto(codigoProyecto),
                "investigadores", investigadorRepo.findByCodigoProyecto(codigoProyecto),
                "entidades", entidadProyectoRepo.findByCodigoProyecto(codigoProyecto),
                "resultados", resultadosRepo.findByCodigoProyecto(codigoProyecto),
                "documentos", documentosRepo.findByCodigoProyecto(codigoProyecto),
                "informes", informesRepo.findByCodigoProyecto(codigoProyecto)
        );
    }

    public Map<String, Object> exportarProyectoFinanciero(String codigoProyecto) {
        RepProyectoBase proyectoBase = this.proyectoBaseRepo.findByCodigoProyecto(codigoProyecto);
        return Map.of(
                "proyecto", proyectoBase,
                "presupuestos", presupuestoBaseRepo.findByCodigoProyecto(codigoProyecto),
                "historialPresupuestal", presupuestoBitRepository.findByIdProyecto(proyectoBase.getIdProyecto()),
                "gastos", gastosRepo.findByCodigoProyecto(codigoProyecto),
                "horas", horasRepo.findByCodigoProyecto(codigoProyecto)
        );
    }

    public Map<String, Object> exportarProyectoCompleto(String codigoProyecto) {
        RepProyectoBase proyectoBase = this.proyectoBaseRepo.findByCodigoProyecto(codigoProyecto);
        return Map.of(
                "proyecto", proyectoBase,
                "investigadores", investigadorRepo.findByCodigoProyecto(codigoProyecto),
                "entidades", entidadProyectoRepo.findByCodigoProyecto(codigoProyecto),
                "resultados", resultadosRepo.findByCodigoProyecto(codigoProyecto),
                "documentos", documentosRepo.findByCodigoProyecto(codigoProyecto),
                "informes", informesRepo.findByCodigoProyecto(codigoProyecto),
                "presupuestos", presupuestoBaseRepo.findByCodigoProyecto(codigoProyecto),
                "historialPresupuestal", presupuestoBitRepository.findByIdProyecto(proyectoBase.getIdProyecto()),
                "gastos", gastosRepo.findByCodigoProyecto(codigoProyecto),
                "horas", horasRepo.findByCodigoProyecto(codigoProyecto)
        );
    }

}

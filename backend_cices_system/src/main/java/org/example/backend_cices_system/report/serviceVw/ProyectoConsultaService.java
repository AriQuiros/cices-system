package org.example.backend_cices_system.report.serviceVw;

import org.example.backend_cices_system.dto.*;
import org.example.backend_cices_system.report.dao.*;
import org.example.backend_cices_system.report.view.RepProyectoBase;
import org.example.backend_cices_system.report.view.RepProyectoResultados;
import org.example.backend_cices_system.service.CatalogoService;
import org.example.backend_cices_system.service.EntidadService;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * @author angie
 */
@Service
public class ProyectoConsultaService {

    private final RepProyectoBaseRepository proyectoBaseRepo;

    public ProyectoConsultaService(
            RepProyectoBaseRepository proyectoBaseRepo
    ) {
        this.proyectoBaseRepo = proyectoBaseRepo;
    }

    public RepProyectoBase obtenerProyectoBasico(String codigoProyecto) {
        return proyectoBaseRepo.findByCodigoProyecto(codigoProyecto);
    }

}


package org.example.backend_cices_system.report.serviceVw;


import org.example.backend_cices_system.report.controller.InvestigadorDetalle;
import org.example.backend_cices_system.report.dto.FormacionDTO;
import org.example.backend_cices_system.report.dto.InvestigadorDetalleDTO;
import org.example.backend_cices_system.report.dto.ProyectoCodigoDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InvestigadorDetalleService {
    private final RepInvestigadorCertificacionesService repInvestigadorCertificacionesService;
    private final RepInvestigadorTitulosService repInvestigadorTitulosService;
    private final RepInvestigadorProyectoService repInvestigadorProyectoService;

    public InvestigadorDetalleService(RepInvestigadorCertificacionesService repInvestigadorCertificacionesService,
                                      RepInvestigadorTitulosService repInvestigadorTitulosService,
                                      RepInvestigadorProyectoService repInvestigadorProyectoService) {
        this.repInvestigadorCertificacionesService = repInvestigadorCertificacionesService;
        this.repInvestigadorTitulosService = repInvestigadorTitulosService;
        this.repInvestigadorProyectoService = repInvestigadorProyectoService;
    }

    public InvestigadorDetalleDTO obtenerInvestigador(String id){
        List<FormacionDTO> certificaciones = repInvestigadorCertificacionesService.buscarPorIdentificacion(id)
                .stream().map(c ->
                        new FormacionDTO(
                                c.getIdentificacion(),
                                c.getNombreInvestigador(),
                                c.getNombreCertificacion(),
                                c.getInstitucion(),
                                c.getTipoCertificacion(),
                                c.getEstadoCertificacion(),
                                c.getFechaExpiracion()
                        )).toList();

        List<FormacionDTO> titulos = repInvestigadorTitulosService.buscarPorIdentificacion(id)
                .stream().map(c ->
                        new FormacionDTO(
                                c.getIdentificacion(),
                                c.getNombreInvestigador(),
                                c.getNombreTitulo(),
                                c.getInstitucion(),
                                c.getNivelTitulo(),
                                null,
                                c.getFechaEmision()
                        )).toList();

        List<ProyectoCodigoDTO> proyectos = repInvestigadorProyectoService.buscarPorIdentificacionInvestigador(id)
                .stream().map(p ->
                        new ProyectoCodigoDTO(
                                p.getCodigoProyecto(),
                                p.getNombreProyecto()
                        )).toList();

        return new InvestigadorDetalleDTO(id,certificaciones, titulos, proyectos);
    }
}

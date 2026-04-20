package org.example.backend_cices_system.report.serviceVw;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.report.dto.FormacionDTO;
import org.example.backend_cices_system.report.dto.InvestigadorDetalleDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InvestigadorDetalleService {
    private final RepInvestigadorCertificacionesService repInvestigadorCertificacionesService;
    private final RepInvestigadorTitulosService repInvestigadorTitulosService;
    private final RepInvestigadorProyectoService repInvestigadorProyectoService;

    public InvestigadorDetalleDTO obtenerInvestigador(String id){
        List<FormacionDTO> certificaciones = repInvestigadorCertificacionesService.obtenerPorIdentificacion(id)
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

        List<String> proyectos =
                repInvestigadorProyectoService
                        .buscarPorIdentificacionInvestigador(id)
                        .stream()
                        .map(rep -> rep.getCodigoProyecto() + " - " + rep.getNombreProyecto())
                        .toList();

        return new InvestigadorDetalleDTO(id,certificaciones, titulos, proyectos);
    }
}

package org.example.backend_cices_system.service.view;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.dto.view.FormacionDTO;
import org.example.backend_cices_system.dto.view.InvestigadorDetalleDTO;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class InvestigadorDetalleService {
    private final RepPersonaUsuariaService personaUsuariaService;
    private final RepInvestigadorCertificacionesService repInvestigadorCertificacionesService;
    private final RepInvestigadorTitulosService repInvestigadorTitulosService;
    private final RepInvestigadorProyectoService repInvestigadorProyectoService;

    public InvestigadorDetalleDTO obtenerInvestigador(String id){
        var personaUsuaria = personaUsuariaService.obtenerPorIdentificacion(id);
        var investigador = personaUsuariaService.construirInvestigadorConsultaDTO(personaUsuaria, Map.of());
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

        return new InvestigadorDetalleDTO(investigador,certificaciones, titulos, proyectos);
    }
}

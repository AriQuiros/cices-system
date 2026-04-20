package org.example.backend_cices_system.report.serviceVw;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.report.dao.RepInvestigadorCertificacionesRepository;
import org.example.backend_cices_system.report.filter.CertificacionFiltroDTO;
import org.example.backend_cices_system.report.dto.FormacionDTO;
import org.example.backend_cices_system.report.specification.CertificacionSpecification;
import org.example.backend_cices_system.report.view.RepInvestigadorCertificaciones;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RepInvestigadorCertificacionesService {

    private final RepInvestigadorCertificacionesRepository repo;
    private final RepPersonaUsuariaService repPersonaUsuariaService;

    // ------------------------------------------------------------------
    // Consultas
    // ------------------------------------------------------------------

    public List<RepInvestigadorCertificaciones> obtenerPorIdentificacion(String idetificacion){
        return repo.findByIdentificacion(idetificacion);
    }

    public String obtenerIdentificacionPorUsuario(Integer idUsuario){
        return repPersonaUsuariaService.obtenerPorIdUsuario(idUsuario).getIdentificacion();
    }

    public Page<FormacionDTO> filtrarCertificacionesPaginado(
            CertificacionFiltroDTO filtro,
            int page,
            int size
    ) {
        Sort sort = sort(filtro.ordenFecha());
        Pageable pageable = PageRequest.of(page, size, sort);

        var spec = CertificacionSpecification.filtrar(
                filtro
        );

        return repo.findAll(spec, pageable)
                .map(this::toDTO);
    }

    public List<FormacionDTO> filtrarCertificaciones(CertificacionFiltroDTO filtro) {
        var spec = CertificacionSpecification.filtrar(
                filtro
        );

        return repo.findAll(spec, sort(filtro.ordenFecha()))
                .stream()
                .map(this::toDTO)
                .toList();
    }

    // ------------------------------------------------------------------
    // Helpers
    // ------------------------------------------------------------------

    private Sort sort(String ordenFecha) {
        return Sort.by(
                "desc".equalsIgnoreCase(ordenFecha) ? Sort.Direction.DESC : Sort.Direction.ASC,
                "fechaExpiracion"
        );
    }

    private FormacionDTO toDTO(RepInvestigadorCertificaciones c) {
        return new FormacionDTO(
                c.getIdentificacion(),        // -> identificacionInvestigador
                c.getNombreInvestigador(),    // -> nombreInvestigador
                c.getNombreCertificacion(),   // -> nombre
                c.getInstitucion(),           // -> institucion
                c.getTipoCertificacion(),     // -> tipo
                c.getEstadoCertificacion(),   // -> estado
                c.getFechaExpiracion()        // -> fecha (LocalDate, ok)
        );
    }

}
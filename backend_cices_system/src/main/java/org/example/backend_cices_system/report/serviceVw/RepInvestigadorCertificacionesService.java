package org.example.backend_cices_system.report.serviceVw;

import org.example.backend_cices_system.jasper.CertificacionesJasperService;
import org.example.backend_cices_system.report.dao.RepInvestigadorCertificacionesRepository;
import org.example.backend_cices_system.report.dto.CertificacionFiltroDTO;
import org.example.backend_cices_system.report.dto.FormacionDTO;
import org.example.backend_cices_system.report.filter.CertificacionSpecification;
import org.example.backend_cices_system.report.view.RepInvestigadorCertificaciones;
import org.springframework.data.domain.*;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class RepInvestigadorCertificacionesService {

    private final RepInvestigadorCertificacionesRepository repo;
    private final CertificacionesJasperService jasperService;

    public RepInvestigadorCertificacionesService(
            RepInvestigadorCertificacionesRepository repo,
            CertificacionesJasperService jasperService
    ) {
        this.repo          = repo;
        this.jasperService = jasperService;
    }

    // ------------------------------------------------------------------
    // Consultas
    // ------------------------------------------------------------------

    public List<RepInvestigadorCertificaciones> obtenerTodos() {
        return repo.findAll();
    }

    public List<RepInvestigadorCertificaciones> buscarPorIdentificacion(String identificacion) {
        return repo.findByIdentificacion(identificacion);
    }

    public Page<FormacionDTO> filtrarCertificacionesPaginado(
            CertificacionFiltroDTO filtro,
            int page,
            int size
    ) {
        Sort sort = sort(filtro.getOrdenFecha());
        Pageable pageable = PageRequest.of(page, size, sort);

        var spec = CertificacionSpecification.filtrar(
                filtro.getNombre(),
                filtro.getTipos(),
                filtro.getEstados()
        );

        return repo.findAll(spec, pageable)
                .map(this::toDTO);
    }

    public List<FormacionDTO> filtrarCertificaciones(CertificacionFiltroDTO filtro) {
        var spec = CertificacionSpecification.filtrar(
                filtro.getNombre(),
                filtro.getTipos(),
                filtro.getEstados()
        );

        return repo.findAll(spec, sort(filtro.getOrdenFecha()))
                .stream()
                .map(this::toDTO)
                .toList();
    }

    // ------------------------------------------------------------------
    // Exportación
    // ------------------------------------------------------------------

    public ResponseEntity<byte[]> generarReporte(
            CertificacionFiltroDTO filtro,
            String formato
    ) {
        List<FormacionDTO> data = filtrarCertificaciones(filtro);

        byte[] archivo = jasperService.generar(data, formato);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=certificaciones." + formato)
                .contentType(contentType(formato))
                .body(archivo);
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


    private MediaType contentType(String formato) {
        return switch (formato.toLowerCase()) {
            case "pdf"  -> MediaType.APPLICATION_PDF;
            case "xlsx" -> MediaType.parseMediaType(
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            case "docx" -> MediaType.parseMediaType(
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
            default     -> MediaType.APPLICATION_OCTET_STREAM;
        };
    }
}
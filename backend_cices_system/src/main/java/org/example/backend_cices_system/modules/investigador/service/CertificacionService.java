package org.example.backend_cices_system.modules.investigador.service;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.modules.investigador.repository.CertificacionRepository;
import org.example.backend_cices_system.modules.investigador.dto.CertificacionDTO;
import org.example.backend_cices_system.modules.investigador.model.Certificacion;
import org.example.backend_cices_system.shared.entidad.Entidad;
import org.example.backend_cices_system.modules.investigador.model.Investigador;
import org.example.backend_cices_system.shared.entidad.EntidadService;
import org.example.backend_cices_system.shared.catalogo.CatalogoService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CertificacionService {

    private final CertificacionRepository certificacionRepository;
    private final CatalogoService catalogoService;
    private final EntidadService entidadService;

    public Certificacion guardarCertificacion(CertificacionDTO certificacionDTO, Investigador investigador) {
        var id = certificacionDTO.id();
        var certificacion = id != null ? obtenerPorId(id) : new Certificacion();
        certificacion.setIdInvestigador(investigador);

        Entidad idEntidadEmisora = entidadService.guardarEntidad(certificacionDTO.entidadEmisora());
        certificacion.setIdEntidad(idEntidadEmisora);

        certificacion.setNombreCertificacion(certificacionDTO.nombreCertificacion());

        var fechaExpira = certificacionDTO.fechaExpiracion();
        certificacion.setFechaExpiracion(fechaExpira);

        certificacion.setIdCodigoTipoCertificacion(certificacionDTO.tipoCertificacion().id());

        Short codigoTipoEstado = catalogoService.codigoXNombreValor("ESTADO_CERTIFICACION",
                fechaExpira != null ? obtenerEstadoCertificacion(fechaExpira): "VIGENTE");

        certificacion.setIdCodigoTipoEstado(codigoTipoEstado);

        certificacionRepository.save(certificacion);

        return certificacion;
    }

    public String obtenerEstadoCertificacion(LocalDate fechaExpiracion) {
        var fechaActual = LocalDate.now();
        long dias = ChronoUnit.DAYS.between(fechaActual, fechaExpiracion);
        if (dias < 0)
            return "VENCIDA";
        if (dias > 90)
            return "VIGENTE";
        else
            return "PROXIMA A VENCER";
    }

    public CertificacionDTO obtenerDTO(Certificacion certificacion){
        return new CertificacionDTO(certificacion.getId(),
                entidadService.obtenerDTO(certificacion.getIdEntidad()),
                certificacion.getNombreCertificacion(),
                catalogoService.obtenerDto(certificacion.getIdCodigoTipoCertificacion()),
                certificacion.getFechaExpiracion(),
                catalogoService.obtenerDto(certificacion.getIdCodigoTipoEstado()));
    }

    public List<CertificacionDTO> certificacionDTOList(Investigador investigador){
        return certificacionRepository.findCertificacionByIdInvestigador(investigador).stream()
                .map(this::obtenerDTO).toList();
    }

    public Certificacion obtenerPorId(Integer id){
        return certificacionRepository.findById(id)
                .orElseThrow(() -> new IllegalStateException
                        ("No se encontró certificación con id '" + id + "'"));
    }

    public CertificacionDTO eliminarCertificacion(Integer id){
        var certificacionDto = obtenerDTO(obtenerPorId(id));
        certificacionRepository.deleteById(id);
        return certificacionDto;
    }

    public List<Certificacion> buscarEntreFechas(LocalDate inicio, LocalDate fin) {
        return certificacionRepository
                .findByFechaExpiracionBetween(inicio, fin);
    }

    public List<Certificacion> buscarVencidas(LocalDate hoy) {
        return certificacionRepository
                .findByFechaExpiracionBefore(hoy);
    }

}


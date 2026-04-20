package org.example.backend_cices_system.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.data.InvestigadorRepository;
import org.example.backend_cices_system.dto.*;
import org.example.backend_cices_system.logic.*;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class InvestigadorService {

    private final EmpleadoService empleadoService;
    private final EntidadService entidadService;
    private final InvestigadorRepository investigadorRepository;
    private final TituloService tituloService;
    private final CertificacionService certificacionService;

    InvestigadorService (EmpleadoService empleadoService,
                        EntidadService entidadService,
                        InvestigadorRepository investigadorRepository,
                        TituloService tituloService,
                        CertificacionService certificacionService) {
        this.empleadoService = empleadoService;
        this.entidadService = entidadService;
        this.investigadorRepository = investigadorRepository;
        this.tituloService = tituloService;
        this.certificacionService = certificacionService;
    }

    @Transactional
    public Investigador crearInvestigador(InvestigadorDTO dto) {

        Investigador investigador = new Investigador();

        investigador.setTemaInteres(dto.temaInteres());

        investigador.setIdInstitucionOrigen(
                entidadService.guardarEntidad(dto.institucionOrigen())
        );

        investigador.setIdUnidadAcademica(
                entidadService.guardarEntidad(dto.unidadAcademica())
        );

        investigador.setIdEmpleado(
                empleadoService.crearEmpleado(dto.empleado())
        );

        investigador = investigadorRepository.save(investigador);

        guardarTitulos(dto.titulos(), investigador);
        guardarCertificaciones(dto.certificaciones(), investigador);

        return investigador;
    }

    private void guardarTitulos(List<TituloDTO> titulos, Investigador investigador) {
        if (titulos == null) return;

        for (TituloDTO dto : titulos) {
            tituloService.guardarTitulo(dto, investigador);
        }
    }

    private void guardarCertificaciones(List<CertificacionDTO> certificaciones, Investigador investigador) {
        if (certificaciones == null || certificaciones.isEmpty()) return;

        for (CertificacionDTO dto : certificaciones) {
            certificacionService.guardarCertificacion(dto, investigador);
        }
    }

    @Transactional
    public Investigador actualizarInvestigador(InvestigadorDTO dto) {

        Investigador investigador = obtenerInvestigador(dto.id());

        investigador.setTemaInteres(dto.temaInteres());

        investigador.setIdInstitucionOrigen(
                entidadService.guardarEntidad(dto.institucionOrigen())
        );

        investigador.setIdUnidadAcademica(
                entidadService.guardarEntidad(dto.unidadAcademica())
        );

        empleadoService.actualizarEmpleado(dto.empleado());

        investigador = investigadorRepository.save(investigador);

        guardarTitulos(dto.titulos(), investigador);
        guardarCertificaciones(dto.certificaciones(), investigador);

        return investigador;
    }

    public Investigador buscarPorIdentificacion(String identificacion) {
        return investigadorRepository.findByIdEmpleadoIdentificacion(identificacion)
                .orElseThrow(() -> new IllegalStateException("No se encontró un investigador con la identificación '" + identificacion + "'"));
    }

    public List<Map<String, String>> obtenerInvestigadoresActivos(String nombre) {
        List<Investigador> investigadores = investigadorRepository
                .findByIdEmpleado_IdUsuario_ActivoAndIdEmpleadoNombreCompletoContainsIgnoreCase(true, nombre);

        return investigadores.stream()
                .map(inv -> {
                    Map<String, String> map = new HashMap<>();
                    map.put("identificacion", inv.getIdEmpleado().getIdentificacion());
                    map.put("nombreCompleto", inv.getIdEmpleado().getNombreCompleto());
                    return map;
                })
                .toList();
    }

    public Investigador obtenerInvestigador(Integer id){
        return investigadorRepository.findById(id)
                .orElseThrow(() -> new IllegalStateException("No se encontró un investigador con el id '" + id + "'"));
    }

    public Investigador obtenerInvestigadorPorUsuario(Usuario usuario){
        return investigadorRepository.findByIdEmpleado_IdUsuario(usuario)
                .orElseThrow(() -> new IllegalStateException
                        ("No se encontró un investigador con usuario '" + usuario.getNombreUsuario() + "'"));
    }

    public InvestigadorDTO obtenerDTO (Investigador investigador){
        return new InvestigadorDTO(
                investigador.getId(),
                empleadoService.obtenerEmpleadoDTO(investigador.getIdEmpleado()),
                entidadService.obtenerDTO(investigador.getIdInstitucionOrigen()),
                entidadService.obtenerDTO(investigador.getIdUnidadAcademica()),
                investigador.getTemaInteres(),
                tituloService.tituloDTOList(investigador),
                certificacionService.certificacionDTOList(investigador)
        );
    }

    public InvestigadorDTO obtenerPerfil(Usuario usuario){
        var investigador = obtenerInvestigadorPorUsuario(usuario);
        return obtenerDTO(investigador);
    }

}

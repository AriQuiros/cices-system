package org.example.backend_cices_system.service;

import jakarta.transaction.Transactional;
import org.example.backend_cices_system.data.InvestigadorRepository;
import org.example.backend_cices_system.dto.*;
import org.example.backend_cices_system.logic.*;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Service
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

        // 1. Crear investigador
        Investigador investigador = new Investigador();
        investigador.setTemaInteres(dto.temaInteres());

        Entidad idInstitucionOrigen = entidadService.guardarEntidad(dto.institucionOrigen());
        investigador.setIdInstitucionOrigen(idInstitucionOrigen);

        Entidad idUnidadAcademica = entidadService.guardarEntidad(dto.unidadAcademica());
        investigador.setIdUnidadAcademica(idUnidadAcademica);

        // 2. Crear empleado + usuario + rol INVESTIGADOR
        Empleado empleado = empleadoService.crearEmpleado(dto.empleado());
        investigador.setIdEmpleado(empleado);

        investigador = investigadorRepository.save(investigador);

        // 3. Títulos
        if (dto.titulos() != null) {
            for (TituloDTO t : dto.titulos()) {
                tituloService.guardarTitulo(t, investigador);
            }
        }

        // 4. Certificaciones
        if (dto.certificaciones() != null) {
            for (CertificacionDTO c : dto.certificaciones()) {
                certificacionService.guardarCertificacion(c, investigador);
            }
        }

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

    /*public InvestigadorDTO obtenerDTO (Investigador investigador){
        return new InvestigadorDTO(
                empleadoService.obtenerEmpleadoDTO(investigador.getIdEmpleado()),
                entidadService.obtenerDTO(investigador.getIdInstitucionOrigen()),
                entidadService.obtenerDTO(investigador.getIdUnidadAcademica()),
                investigador.getTemaInteres(),

        )
    }*/
}

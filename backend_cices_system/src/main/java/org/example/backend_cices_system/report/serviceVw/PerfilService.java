package org.example.backend_cices_system.report.serviceVw;

import org.example.backend_cices_system.dto.*;
import org.example.backend_cices_system.logic.Usuario;
import org.example.backend_cices_system.report.view.*;
import org.example.backend_cices_system.report.dao.*;
import org.example.backend_cices_system.service.CatalogoService;
import org.example.backend_cices_system.service.EntidadService;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PerfilService {
    private final RepPersonaUsuariaService personaUsuariaService;
    private final RepInvestigadorTitulosService titulosService;
    private final RepInvestigadorCertificacionesService certificacionesService;
    private final EntidadService entidadService;
    private final CatalogoService catalogoService;

    public PerfilService(RepPersonaUsuariaService personaUsuariaService, RepInvestigadorTitulosService titulosService,
                         RepInvestigadorCertificacionesService certificacionesService, EntidadService entidadService,
                         CatalogoService catalogoService) {
        this.personaUsuariaService = personaUsuariaService;
        this.titulosService = titulosService;
        this.certificacionesService = certificacionesService;
        this.entidadService = entidadService;
        this.catalogoService = catalogoService;
    }

    private CodigoDTO construirCodigo(String tipo, String valor) {
        if (valor == null) return null;

        Short id = catalogoService.codigoXNombreValor(tipo, valor);
        return catalogoService.obtenerDto(id);
    }


    private CodigoDTO construirCodigoPorId(Short id) {
        return id == null ? null : catalogoService.obtenerDto(id);
    }

    private EntidadDTO construirEntidad(Integer idEntidad, String nombreFallback) {
        if (idEntidad == null) return null;

        try {
            return entidadService.obtenerDTO(entidadService.obtenerPorId(idEntidad));
        } catch (Exception e) {
            // fallback si algo falla
            return new EntidadDTO(idEntidad, nombreFallback, null);
        }
    }

    private List<RolDTO> construirRoles(List<RepPersonaUsuaria> registros) {
        return registros.stream()
                .map(r -> new RolDTO(r.getIdRol(), r.getNombreRol()))
                .distinct()
                .toList();
    }

    private UsuarioDTO construirUsuario(RepPersonaUsuaria base, List<RolDTO> roles) {
        return new UsuarioDTO(
                base.getIdUsuario(),
                base.getNombreUsuario(),
                null,
                roles
        );
    }

    private EmpleadoDTO construirEmpleado(List<RepPersonaUsuaria> registros) {

        RepPersonaUsuaria base = registros.getFirst();

        List<RolDTO> roles = construirRoles(registros);

        UsuarioDTO usuario = construirUsuario(base, roles);

        return new EmpleadoDTO(
                base.getIdEmpleado(),
                base.getNombreCompleto(),
                base.getIdentificacion(),
                construirCodigoPorId(base.getIdCodigoTipoId()),
                base.getPais(),
                base.getCorreo(),
                base.getNumeroTelefono(),
                construirCodigoPorId(base.getIdCodigoTipoGradoAcademico()),
                usuario
        );
    }

    public EmpleadoDTO obtenerPerfilEmpleado(String username) {

        List<RepPersonaUsuaria> registros = personaUsuariaService.obtenerPorUsuario(username);

        if (registros.isEmpty()) {
            throw new RuntimeException("Usuario no encontrado");
        }

        return construirEmpleado(registros);
    }

    private List<TituloDTO> construirTitulos(String identificacion) {

        return titulosService.buscarPorIdentificacion(identificacion)
                .stream()
                .map(t -> new TituloDTO(
                        t.getIdTitulo(),
                        construirEntidad(t.getIdEntidad(), t.getInstitucion()),
                        t.getNombreTitulo(),
                        construirCodigoPorId(t.getIdCodigoTipoNivelTitulo()),
                        t.getFechaEmision()
                ))
                .toList();
    }

    private List<CertificacionDTO> construirCertificaciones(String identificacion) {

        return certificacionesService.buscarPorIdentificacion(identificacion)
                .stream()
                .map(c -> new CertificacionDTO(
                        c.getIdCertificacion(),
                        construirEntidad(c.getIdEntidad(), c.getInstitucion()),
                        c.getNombreCertificacion(),
                        construirCodigoPorId(c.getIdCodigoTipoCertificacion()),
                        c.getFechaExpiracion(),
                        construirCodigo("ESTADO_CERTIFICACION", c.getEstadoCertificacion())
                ))
                .toList();
    }

    public InvestigadorDTO obtenerPerfilInvestigador(String username) {

        List<RepPersonaUsuaria> registros = personaUsuariaService.obtenerPorUsuario(username);

        if (registros.isEmpty()) {
            throw new RuntimeException("Usuario no encontrado");
        }

        RepPersonaUsuaria base = registros.getFirst();

        EmpleadoDTO empleado = construirEmpleado(registros);

        // ✅ entidades usando service
        EntidadDTO institucion = construirEntidad(
                base.getIdInstitucionOrigen(),
                base.getInstitucionOrigen()
        );

        EntidadDTO unidad = construirEntidad(
                base.getIdUnidadAcademica(),
                base.getUnidadAcademica()
        );

        // ✅ formación
        List<TituloDTO> titulos = construirTitulos(base.getIdentificacion());
        List<CertificacionDTO> certificaciones = construirCertificaciones(base.getIdentificacion());

        return new InvestigadorDTO(
                empleado,
                institucion,
                unidad,
                base.getTemaInteres(),
                titulos,
                certificaciones
        );
    }

}

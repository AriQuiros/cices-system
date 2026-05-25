package org.example.backend_cices_system.service.shared;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.model.entity.Certificacion;
import org.example.backend_cices_system.model.entity.PermisoProyecto;
import org.example.backend_cices_system.dto.entity.NotificacionDTO;
import org.example.backend_cices_system.model.entity.Notificacion;
import org.example.backend_cices_system.model.entity.PresentacionInforme;
import org.example.backend_cices_system.model.entity.Usuario;
import org.example.backend_cices_system.service.entity.RolUsuarioService;
import org.example.backend_cices_system.service.entity.NotificacionService;
import org.example.backend_cices_system.service.entity.NotificacionUsuarioService;
import org.springframework.stereotype.Service;

import java.time.Clock;
import java.time.LocalDate;
import java.util.LinkedHashSet;
import java.util.List;

import static org.example.backend_cices_system.utils.ReportBuilderUtils.fmt;

/**
 * Responsabilidad única: saber CUÁNDO y A QUIÉN generar cada tipo de notificación.
 * NO hace acciones CRUD directas — las delega a NotificacionService y NotificacionUsuarioService.
 */
@Service
@RequiredArgsConstructor
public class NotificacionGeneradorService {

    private final NotificacionService notificacionService;
    private final NotificacionUsuarioService notificacionUsuarioService;
    private final RolUsuarioService rolUsuarioService;
    private final Clock clock;

    // ════════════════════════════════════════════════════════════════════════
    // PERMISOS DE COORDINADOR
    // ════════════════════════════════════════════════════════════════════════

    @Transactional
    public void generarNotificacionPermiso(PermisoProyecto permiso) {
        var usuario = permiso.getIdInvestigadorProyecto()
                .getIdInvestigador().getIdEmpleado().getIdUsuario();
        var codigoProyecto = permiso.getIdInvestigadorProyecto()
                .getIdProyecto().getCodigoProyecto();

        var fechaFin = permiso.getFechaFinPermiso() != null
                ? fmt(permiso.getFechaFinPermiso()) : "Indefinido";

        var clave = notificacionService.crearClave("PERMISO_COORDINADOR", permiso.getId(), 0);

        var notificacion = notificacionService.guardarNotificacion(
                new NotificacionDTO(null, "PERMISO_COORDINADOR", null,
                        "Permiso Coordinador en proyecto '" + codigoProyecto + "'",
                        "Codigo de proyecto: " + codigoProyecto
                                + "; Fecha de inicio: " + fmt(permiso.getFechaInicioPermiso())
                                + "; Fecha fin: " + fechaFin,
                        LocalDate.now(clock)),
                permiso.getId(), clave);

        notificacionUsuarioService.guardarNotificacionUsuario(notificacion, usuario);
    }

    // ════════════════════════════════════════════════════════════════════════
    // INFORMES
    // ════════════════════════════════════════════════════════════════════════

    @Transactional
    public void generarNotificacionInforme(PresentacionInforme inf, long diasRestantes,
                                           List<Usuario> investigadores) {
        var categoria = "INFORME";
        var proyecto = inf.getIdProyecto();
        var clave = notificacionService.crearClave(categoria, inf.getId(), (int) diasRestantes);

        if (notificacionService.existeNotificacionHoy(clave)) return;

        var notificacion = notificacionService.guardarNotificacion(
                new NotificacionDTO(null, categoria, null,
                        "Presentación de informe - " + proyecto.getCodigoProyecto(),
                        "Codigo de proyecto: " + proyecto.getCodigoProyecto()
                                + "; Numero de informe: " + inf.getId()
                                + "; Fecha de presentacion: " + fmt(inf.getFechaPresentacion()),
                        LocalDate.now(clock)),
                inf.getId(), clave);

        investigadores.forEach(u ->
                notificacionUsuarioService.guardarNotificacionUsuario(notificacion, u));
    }

    // ════════════════════════════════════════════════════════════════════════
    // CERTIFICACIONES
    // ════════════════════════════════════════════════════════════════════════

    @Transactional
    public void generarNotificacionCertificacion(Certificacion cert, long diasRestantes) {
        var categoria = "CERTIFICACION";
        var clave = notificacionService.crearClave(categoria, cert.getId(), (int) diasRestantes);

        if (notificacionService.existeNotificacionHoy(clave)) return;

        var empleado = cert.getIdInvestigador().getIdEmpleado();
        var notificacion = notificacionService.guardarNotificacion(
                new NotificacionDTO(null, categoria, null,
                        (diasRestantes < 0 ? "Certificación vencida" : "Certificación por vencer")
                                + " - " + empleado.getIdentificacion(),
                        "Nombre de la acreditacion o licencia: " + cert.getNombreCertificacion()
                                + "; Fecha de expiracion: " + fmt(cert.getFechaExpiracion())
                                + "; Nombre del investigador: " + empleado.getNombreCompleto(),
                        LocalDate.now(clock)),
                cert.getId(), clave);

        asignarUsuariosCertificacion(notificacion, cert);
    }

    // ════════════════════════════════════════════════════════════════════════
    // HELPERS PRIVADOS
    // ════════════════════════════════════════════════════════════════════════

    private void asignarUsuariosCertificacion(Notificacion notificacion, Certificacion cert) {
        var usuarioInv = cert.getIdInvestigador().getIdEmpleado().getIdUsuario();
        var todos = new LinkedHashSet<Usuario>();
        todos.add(usuarioInv);
        rolUsuarioService.obtenerRolesUsuarioPorNombreRol("ADMINISTRATIVO")
                .forEach(r -> todos.add(r.getIdUsuario()));
        rolUsuarioService.obtenerRolesUsuarioPorNombreRol("DIRECCION")
                .forEach(r -> todos.add(r.getIdUsuario()));
        todos.forEach(u -> notificacionUsuarioService.guardarNotificacionUsuario(notificacion, u));
    }
}
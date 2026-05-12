package org.example.backend_cices_system.modules.notificacion.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.modules.investigador.model.Certificacion;
import org.example.backend_cices_system.modules.investigadorProyecto.model.PermisoProyecto;
import org.example.backend_cices_system.modules.notificacion.dto.NotificacionDTO;
import org.example.backend_cices_system.modules.notificacion.model.Notificacion;
import org.example.backend_cices_system.modules.proyecto.model.PresentacionInforme;
import org.example.backend_cices_system.modules.usuario.model.Usuario;
import org.example.backend_cices_system.modules.usuario.service.RolUsuarioService;
import org.springframework.stereotype.Service;

import java.time.Clock;
import java.time.LocalDate;
import java.util.LinkedHashSet;
import java.util.List;

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
                ? permiso.getFechaFinPermiso().toString() : "Indefinido";

        var clave = notificacionService.crearClave("PERMISO_COORDINADOR", permiso.getId(), 0);

        var notificacion = notificacionService.guardarNotificacion(
                new NotificacionDTO(null, "PERMISO_COORDINADOR", null,
                        "Permiso Coordinador en proyecto '" + codigoProyecto + "'",
                        "Codigo de proyecto: " + codigoProyecto
                                + "; Fecha de inicio: " + permiso.getFechaInicioPermiso()
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
                                + "; Fecha de presentacion: " + inf.getFechaPresentacion(),
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
                                + "; Fecha de expiracion: " + cert.getFechaExpiracion()
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
        rolUsuarioService.obtenerRolesUsuarioPorNombreRol("ADMINISTRACION")
                .forEach(r -> todos.add(r.getIdUsuario()));
        rolUsuarioService.obtenerRolesUsuarioPorNombreRol("DIRECCION")
                .forEach(r -> todos.add(r.getIdUsuario()));
        todos.forEach(u -> notificacionUsuarioService.guardarNotificacionUsuario(notificacion, u));
    }
}
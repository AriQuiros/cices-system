package org.example.backend_cices_system.service;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.dto.NotificacionDTO;
import org.example.backend_cices_system.logic.Certificacion;
import org.example.backend_cices_system.logic.Notificacion;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Clock;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificacionSchedulerService {

    private final NotificacionService notificacionService;
    private final NotificacionUsuarioService notificacionUsuarioService;

    // Informes
    private final PresentacionInformeService presentacionInformeService;
    private final InvestigadorProyectoService investigadorProyectoService;

    // Certificaciones
    private final CertificacionService certificacionService;
    private final RolUsuarioService rolUsuarioService;

    private final Clock clock;

    //@Scheduled(cron = "0 0 0 * * *", zone = "America/Costa_Rica") // todos los días a media noche
    @Scheduled(cron = "0 0 */12 * * *", zone = "America/Costa_Rica") // cada 12 horas
    public synchronized void ejecutarNotificaciones() {
        generarNotificacionesInformes();
        generarNotificacionesCertificacionesProximas();
        generarNotificacionesCertificacionesVencidas();
        limpiarNotificacionesAntiguas();
    }

    private LocalDate hoy() {
        return LocalDate.now(clock);
    }

    // =========================
    // INFORMES
    // =========================
    private void generarNotificacionesInformes() {
        var categoria = "INFORME";

        var hoy = hoy();
        var max = hoy.plusDays(30);

        var informes = presentacionInformeService.buscarEntreFechas(hoy, max);

        for (var inf : informes) {

            long dias = ChronoUnit.DAYS.between(hoy, inf.getFechaPresentacion());
            if (!List.of(30, 15, 7, 3, 0).contains(dias)) continue;

            var proyecto = inf.getIdProyecto();

            var clave = notificacionService.crearClave(categoria, inf.getId(), (int) dias);
            if (notificacionService.existeNotificacionHoy(clave)) continue;

            var notificacion = notificacionService.guardarNotificacion(
                    new NotificacionDTO(
                            null,
                            categoria,
                            null,
                            "Presentación de informe - " + proyecto.getCodigoProyecto(),
                            "Proyecto: " + proyecto.getCodigoProyecto()
                                    + " | Fecha: " + inf.getFechaPresentacion(),
                            hoy()
                    ),
                    inf.getId(),
                    clave
            );

            var investigadores = investigadorProyectoService.obtenerPorProyecto(proyecto);

            for (var inv : investigadores) {
                var usuario = inv.getIdInvestigador()
                        .getIdEmpleado()
                        .getIdUsuario();

                notificacionUsuarioService
                        .guardarNotificacionUsuario(notificacion, usuario);
            }
        }
    }

    // =========================
    // CERTIFICACIONES
    // =========================
    private void generarNotificacionesCertificacionesProximas() {
        var categoria = "CERTIFICACION";

        var hoy = hoy();
        var max = hoy.plusDays(90);

        var certificaciones = certificacionService.buscarEntreFechas(hoy, max);

        for (var cert : certificaciones) {

            long dias = ChronoUnit.DAYS.between(hoy, cert.getFechaExpiracion());

            if (!List.of(90, 60, 30, 14).contains(dias)) continue;

            var clave = notificacionService.crearClave(categoria, cert.getId(), (int) dias);
            if (notificacionService.existeNotificacionHoy(clave)) continue;

            var notificacion = notificacionService.guardarNotificacion(
                    new NotificacionDTO(
                            null,
                            categoria,
                            null,
                            "Certificación por vencer",
                            "Certificación: " + cert.getNombreCertificacion()
                                    + " | Expira: " + cert.getFechaExpiracion(),
                            hoy()
                    ),
                    cert.getId(),
                    clave
            );

            asignarUsuariosCertificacion(notificacion, cert);
        }
    }

    private void generarNotificacionesCertificacionesVencidas() {
        var categoria = "CERTIFICACION";

        var hoy = hoy();

        var certificaciones = certificacionService.buscarVencidas(hoy);

        for (var cert : certificaciones) {

            var clave = notificacionService.crearClave(categoria, cert.getId(), -1);

            if (notificacionService.existeNotificacionHoy(clave)) continue;

            var notificacion = notificacionService.guardarNotificacion(
                    new NotificacionDTO(
                            null,
                            categoria,
                            null,
                            "Certificación vencida",
                            clave + " | Certificación: " + cert.getNombreCertificacion()
                                    + " venció el " + cert.getFechaExpiracion(),
                            hoy()
                    ),
                    cert.getId(),
                    clave
            );

            asignarUsuariosCertificacion(notificacion, cert);
        }
    }

    private void asignarUsuariosCertificacion(Notificacion notificacion, Certificacion cert) {

        var usuarioInvestigador = cert.getIdInvestigador()
                .getIdEmpleado()
                .getIdUsuario();

        notificacionUsuarioService
                .guardarNotificacionUsuario(notificacion, usuarioInvestigador);

        var admins = rolUsuarioService.obtenerRolesUsuarioPorNombreRol("ADMINISTRACION");
        admins.forEach(r ->
                notificacionUsuarioService
                        .guardarNotificacionUsuario(notificacion, r.getIdUsuario())
        );

        var directores = rolUsuarioService.obtenerRolesUsuarioPorNombreRol("DIRECCION");
        directores.forEach(r ->
                notificacionUsuarioService
                        .guardarNotificacionUsuario(notificacion, r.getIdUsuario())
        );
    }

    // =========================
    // LIMPIEZA - cada 30 días
    // =========================
    private void limpiarNotificacionesAntiguas() {
        var fechaLimite = hoy().minusDays(30);
        notificacionService.eliminarNotificacionesAntiguas(fechaLimite);
    }
}

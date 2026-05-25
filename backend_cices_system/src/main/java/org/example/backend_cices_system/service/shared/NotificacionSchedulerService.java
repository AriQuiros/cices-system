package org.example.backend_cices_system.service.shared;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.model.entity.Certificacion;
import org.example.backend_cices_system.service.entity.CertificacionService;
import org.example.backend_cices_system.service.entity.InvestigadorProyectoService;
import org.example.backend_cices_system.model.entity.PresentacionInforme;
import org.example.backend_cices_system.service.entity.PresentacionInformeService;
import org.example.backend_cices_system.model.entity.Usuario;
import org.example.backend_cices_system.service.entity.NotificacionService;
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
    private final NotificacionGeneradorService generadorService;
    private final PresentacionInformeService presentacionInformeService;
    private final InvestigadorProyectoService investigadorProyectoService;
    private final CertificacionService certificacionService;
    private final Clock clock;

    @Scheduled(cron = "0 0 */12 * * *", zone = "America/Costa_Rica") // 00:00 y 12:00
    @Transactional
    public synchronized void ejecutarNotificaciones() {
        generarNotificacionesInformes();
        generarNotificacionesCertificaciones();
        limpiarNotificacionesAntiguas();
    }

    private LocalDate hoy() { return LocalDate.now(clock); }

    // ════════════════════════════════════════════════════════════════════════
    // INFORMES
    // ════════════════════════════════════════════════════════════════════════

    private void generarNotificacionesInformes() {
        LocalDate hoy = hoy();
        List<PresentacionInforme> informes =
                presentacionInformeService.buscarEntreFechas(hoy, hoy.plusDays(30));

        for (PresentacionInforme inf : informes) {
            long dias = ChronoUnit.DAYS.between(hoy, inf.getFechaPresentacion());
            if (!List.of(30L, 15L, 7L, 3L, 0L).contains(dias)) continue;

            List<Usuario> investigadores = investigadorProyectoService
                    .obtenerPorProyecto(inf.getIdProyecto())
                    .stream()
                    .map(ip -> ip.getIdInvestigador().getIdEmpleado().getIdUsuario())
                    .toList();

            generadorService.generarNotificacionInforme(inf, dias, investigadores);
        }
    }

    // ════════════════════════════════════════════════════════════════════════
    // CERTIFICACIONES (próximas + vencidas)
    // ════════════════════════════════════════════════════════════════════════

    private void generarNotificacionesCertificaciones() {
        LocalDate hoy = hoy();

        // Próximas a vencer
        for (Certificacion cert : certificacionService.buscarEntreFechas(hoy, hoy.plusDays(90))) {
            long dias = ChronoUnit.DAYS.between(hoy, cert.getFechaExpiracion());
            if (!List.of(90L, 60L, 30L, 14L).contains(dias)) continue;
            generadorService.generarNotificacionCertificacion(cert, dias);
        }

        // Vencidas
        for (Certificacion cert : certificacionService.buscarVencidas(hoy)) {
            generadorService.generarNotificacionCertificacion(cert, -1L);
        }
    }

    // ════════════════════════════════════════════════════════════════════════
    // LIMPIEZA — 30 días
    // ════════════════════════════════════════════════════════════════════════

    private void limpiarNotificacionesAntiguas() {
        notificacionService.eliminarNotificacionesAntiguas(hoy().minusDays(30));
    }
}
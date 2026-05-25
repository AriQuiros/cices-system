package org.example.backend_cices_system.service.shared;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.repository.entity.CertificacionRepository;
import org.example.backend_cices_system.service.entity.CertificacionService;
import org.example.backend_cices_system.repository.entity.PermisoProyectoRepository;
import org.example.backend_cices_system.repository.entity.PresentacionInformeRepository;
import org.example.backend_cices_system.repository.entity.ProyectoRepository;
import org.example.backend_cices_system.service.entity.CatalogoService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Clock;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class MantenimientoSchedulerService {

    private static final Logger log = LoggerFactory.getLogger(MantenimientoSchedulerService.class);

    private final ProyectoRepository proyectoRepository;
    private final CertificacionRepository certificacionRepository;
    private final CertificacionService certificacionService;
    private final PresentacionInformeRepository informeRepository;
    private final PermisoProyectoRepository permisoProyectoRepository;
    private final CatalogoService catalogoService;
    private final Clock clock;

    @Scheduled(cron = "0 0 */12 * * *", zone = "America/Costa_Rica")
    @Transactional
    public synchronized void ejecutarMantenimiento() {
        actualizarEstadosProyectos();
        actualizarEstadosCertificaciones();
        actualizarEstadosInformes();
        eliminarPermisosVencidos();
    }

    // ════════════════════════════════════════════════════════════════════════
    // ESTADOS DE PROYECTOS
    // ════════════════════════════════════════════════════════════════════════

    private void actualizarEstadosProyectos() {
        LocalDate hoy = LocalDate.now(clock);
        Short activoCode    = catalogoService.codigoXNombreValor("ESTADO_PROYECTO", "ACTIVO");
        Short finalizadoCode = catalogoService.codigoXNombreValor("ESTADO_PROYECTO", "FINALIZADO");

        proyectoRepository.findByFechaFinalizacionIsNotNull().forEach(p -> {
            Short esperado = p.getFechaFinalizacion().isBefore(hoy) ? finalizadoCode : activoCode;
            if (!esperado.equals(p.getIdCodigoTipoEstado())) {
                p.setIdCodigoTipoEstado(esperado);
                proyectoRepository.save(p);
            }
        });

        log.info("[Mantenimiento] Estados de proyectos actualizados");
    }

    // ════════════════════════════════════════════════════════════════════════
    // ESTADOS DE CERTIFICACIONES
    // ════════════════════════════════════════════════════════════════════════

    private void actualizarEstadosCertificaciones() {
        certificacionRepository.findByFechaExpiracionIsNotNull().forEach(cert -> {
            String estadoCalculado = certificacionService
                    .obtenerEstadoCertificacion(cert.getFechaExpiracion());
            Short estadoCode = catalogoService.codigoXNombreValor(
                    "ESTADO_CERTIFICACION", estadoCalculado);
            if (!estadoCode.equals(cert.getIdCodigoTipoEstado())) {
                cert.setIdCodigoTipoEstado(estadoCode);
                certificacionRepository.save(cert);
            }
        });

        log.info("[Mantenimiento] Estados de certificaciones actualizados");
    }

    // ════════════════════════════════════════════════════════════════════════
    // ESTADOS DE INFORMES
    // ════════════════════════════════════════════════════════════════════════

    private void actualizarEstadosInformes() {
        LocalDate hoy = LocalDate.now(clock);
        Short pendienteCode  = catalogoService.codigoXNombreValor("ESTADO_INFORME", "PENDIENTE");
        Short presentadoCode = catalogoService.codigoXNombreValor("ESTADO_INFORME", "PRESENTADO");

        // Informes cuya fecha de presentación ya pasó y siguen en PENDIENTE → PRESENTADO
        informeRepository.findByFechaPresentacionBeforeAndIdCodigoTipoEstado(hoy, pendienteCode)
                .forEach(inf -> {
                    inf.setIdCodigoTipoEstado(presentadoCode);
                    informeRepository.save(inf);
                });

        log.info("[Mantenimiento] Estados de informes actualizados");
    }

    // ════════════════════════════════════════════════════════════════════════
    // LIMPIEZA DE PERMISOS VENCIDOS
    // ════════════════════════════════════════════════════════════════════════

    private void eliminarPermisosVencidos() {
        LocalDate hoy = LocalDate.now(clock);
        var vencidos = permisoProyectoRepository
                .findByFechaFinPermisoBeforeAndFechaFinPermisoIsNotNull(hoy);
        if (!vencidos.isEmpty()) {
            permisoProyectoRepository.deleteAll(vencidos);
            log.info("[Mantenimiento] {} permisos vencidos eliminados", vencidos.size());
        }
    }
}
package org.example.backend_cices_system.service;

import org.example.backend_cices_system.logic.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
@ExtendWith(MockitoExtension.class)
class NotificacionSchedulerServiceTest {

    @Mock private NotificacionService notificacionService;
    @Mock private NotificacionUsuarioService notificacionUsuarioService;
    @Mock private PresentacionInformeService presentacionInformeService;
    @Mock private InvestigadorProyectoService investigadorProyectoService;
    @Mock private CertificacionService certificacionService;
    @Mock private RolUsuarioService rolUsuarioService;

    @InjectMocks
    private NotificacionSchedulerService schedulerService;

    @BeforeEach
    void setup() {
        Clock fixedClock = Clock.fixed(
                Instant.parse("2026-04-01T00:00:00Z"),
                ZoneId.systemDefault()
        );

        schedulerService = new NotificacionSchedulerService(
                notificacionService,
                notificacionUsuarioService,
                presentacionInformeService,
                investigadorProyectoService,
                certificacionService,
                rolUsuarioService,
                fixedClock
        );
    }

    @Test
    void deberiaGenerarNotificacionInforme_30_dias() {
        // Arrange
        var hoy = LocalDate.of(2026, 4, 1);
        var fechaInforme = hoy.plusDays(30);

        var informe = mock(PresentacionInforme.class);
        var proyecto = mock(Proyecto.class);

        when(informe.getFechaPresentacion()).thenReturn(fechaInforme);
        when(informe.getId()).thenReturn(1);
        when(informe.getIdProyecto()).thenReturn(proyecto);
        when(proyecto.getCodigoProyecto()).thenReturn("PRJ-001");

        when(presentacionInformeService.buscarEntreFechas(any(), any()))
                .thenReturn(List.of(informe));

        System.out.println("Hoy: " + hoy);
        System.out.println("Fecha informe: " + fechaInforme);
        System.out.println(ChronoUnit.DAYS.between(hoy, fechaInforme));

        when(notificacionService.crearClave(any(), any(), any()))
                .thenReturn("clave_test");

        when(notificacionService.existeNotificacionHoy("clave_test"))
                .thenReturn(false);

        var notificacion = new Notificacion();
        when(notificacionService.guardarNotificacion(any(), any(), any()))
                .thenReturn(notificacion);

        // mock investigadores
        var inv = mock(InvestigadorProyecto.class);
        var investigador = mock(Investigador.class);
        var empleado = mock(Empleado.class);
        var usuario = mock(Usuario.class);

        when(inv.getIdInvestigador()).thenReturn(investigador);
        when(investigador.getIdEmpleado()).thenReturn(empleado);
        when(empleado.getIdUsuario()).thenReturn(usuario);

        when(investigadorProyectoService.obtenerPorProyecto(any()))
                .thenReturn(List.of(inv));

        // Act
        schedulerService.ejecutarNotificaciones();

        // Assert
        verify(notificacionService).guardarNotificacion(any(), eq(1), eq("clave_test"));
        verify(notificacionUsuarioService).guardarNotificacionUsuario(notificacion, usuario);
    }

    @Test
    void noDebeGenerarNotificacionSiYaExisteHoy() {
        // Arrange
        var informe = mock(PresentacionInforme.class);

        when(informe.getFechaPresentacion()).thenReturn(LocalDate.of(2026, 5, 1)); // 30 días
        when(informe.getId()).thenReturn(1);

        when(presentacionInformeService.buscarEntreFechas(any(), any()))
                .thenReturn(List.of(informe));

        when(notificacionService.crearClave(any(), any(), any()))
                .thenReturn("clave_test");

        when(notificacionService.existeNotificacionHoy("clave_test"))
                .thenReturn(true);

        // Act
        schedulerService.ejecutarNotificaciones();

        // Assert
        verify(notificacionService, never()).guardarNotificacion(any(), any(), any());
    }

    @Test
    void deberiaGenerarNotificacionCertificacionVencida() {
        var cert = mock(Certificacion.class);

        when(cert.getId()).thenReturn(1);
        when(cert.getNombreCertificacion()).thenReturn("Java");
        when(cert.getFechaExpiracion()).thenReturn(LocalDate.of(2026, 3, 1));

        when(certificacionService.buscarVencidas(any()))
                .thenReturn(List.of(cert));

        when(notificacionService.crearClave(any(), any(), any()))
                .thenReturn("clave_vencida");

        when(notificacionService.existeNotificacionHoy("clave_vencida"))
                .thenReturn(false);

        var notificacion = new Notificacion();
        when(notificacionService.guardarNotificacion(any(), any(), any()))
                .thenReturn(notificacion);

        // usuario investigador
        var usuario = mock(Usuario.class);
        var empleado = mock(Empleado.class);
        var investigador = mock(Investigador.class);

        when(cert.getIdInvestigador()).thenReturn(investigador);
        when(investigador.getIdEmpleado()).thenReturn(empleado);
        when(empleado.getIdUsuario()).thenReturn(usuario);

        when(rolUsuarioService.obtenerRolesUsuarioPorNombreRol(any()))
                .thenReturn(List.of());

        // Act
        schedulerService.ejecutarNotificaciones();

        // Assert
        verify(notificacionService).guardarNotificacion(any(), eq(1), eq("clave_vencida"));
        verify(notificacionUsuarioService).guardarNotificacionUsuario(notificacion, usuario);
    }
}
package org.example.backend_cices_system.service;
/*
import org.example.backend_cices_system.modules.notificacion.dto.NotificacionDTO;
import org.example.backend_cices_system.modules.investigador.model.Certificacion;
import org.example.backend_cices_system.modules.investigador.model.Investigador;
import org.example.backend_cices_system.modules.investigador.service.CertificacionService;
import org.example.backend_cices_system.modules.investigadorProyecto.model.InvestigadorProyecto;
import org.example.backend_cices_system.modules.investigadorProyecto.service.InvestigadorProyectoService;
import org.example.backend_cices_system.modules.notificacion.model.Notificacion;
import org.example.backend_cices_system.modules.notificacion.service.NotificacionSchedulerService;
import org.example.backend_cices_system.modules.notificacion.service.NotificacionService;
import org.example.backend_cices_system.modules.notificacion.service.NotificacionUsuarioService;
import org.example.backend_cices_system.modules.persona.model.Empleado;
import org.example.backend_cices_system.modules.proyecto.model.PresentacionInforme;
import org.example.backend_cices_system.modules.proyecto.model.Proyecto;
import org.example.backend_cices_system.modules.proyecto.service.PresentacionInformeService;
import org.example.backend_cices_system.modules.usuario.model.RolUsuario;
import org.example.backend_cices_system.modules.usuario.model.Usuario;
import org.example.backend_cices_system.modules.usuario.service.RolUsuarioService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
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


    private NotificacionSchedulerService schedulerService;

    // Fecha fija: 2026-04-01 medianoche hora Costa Rica
    private static final LocalDate HOY = LocalDate.of(2026, 4, 1);
    private static final Clock FIXED_CLOCK = Clock.fixed(
            Instant.parse("2026-04-01T06:00:00Z"), // 00:00 CR = 06:00 UTC
            ZoneId.of("America/Costa_Rica")
    );

    @BeforeEach
    void setup() {
        schedulerService = new NotificacionSchedulerService(
                notificacionService,
                notificacionUsuarioService,
                presentacionInformeService,
                investigadorProyectoService,
                certificacionService,
                rolUsuarioService,
                FIXED_CLOCK
        );

        // Por defecto no hay informes ni certificaciones (para aislar cada test)
        lenient().when(presentacionInformeService.buscarEntreFechas(any(), any()))
                .thenReturn(List.of());
        lenient().when(certificacionService.buscarEntreFechas(any(), any()))
                .thenReturn(List.of());
        lenient().when(certificacionService.buscarVencidas(any()))
                .thenReturn(List.of());
    }

    // ─────────────────────────────────────────────────────────────────────────
    // HELPERS
    // ─────────────────────────────────────────────────────────────────────────

    private Certificacion mockCertificacion(int id, String nombre, LocalDate expiracion) {
        var cert        = mock(Certificacion.class);
        var investigador = mock(Investigador.class);
        var empleado    = mock(Empleado.class);
        var usuario     = mock(Usuario.class);

        lenient().when(cert.getId()).thenReturn(id);
        lenient().when(cert.getNombreCertificacion()).thenReturn(nombre);
        lenient().when(cert.getFechaExpiracion()).thenReturn(expiracion);
        lenient().when(cert.getIdInvestigador()).thenReturn(investigador);
        lenient().when(investigador.getIdEmpleado()).thenReturn(empleado);
        lenient().when(empleado.getIdUsuario()).thenReturn(usuario);

        return cert;
    }

    // Configura los mocks comunes para que guardarNotificacion devuelva una instancia real.
    private Notificacion configurarGuardadoExitoso(String clave) {
        when(notificacionService.crearClave(any(), any(), any())).thenReturn(clave);
        when(notificacionService.existeNotificacionHoy(clave)).thenReturn(false);

        var notificacion = new Notificacion();
        when(notificacionService.guardarNotificacion(any(), any(), any()))
                .thenReturn(notificacion);
        return notificacion;
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


    // ─────────────────────────────────────────────────────────────────────────
    // CERTIFICACIONES PRÓXIMAS — días válidos: 90, 60, 30, 14
    // ─────────────────────────────────────────────────────────────────────────

    @ParameterizedTest(name = "Debe generar notificación de certificación próxima a {0} días")
    @ValueSource(ints = {90, 60, 30, 14})
    void deberiaGenerarNotificacion_CertificacionProxima_DiasValidos(int dias) {
        var expiracion = HOY.plusDays(dias);
        var cert = mockCertificacion(1, "AWS Solutions Architect", expiracion);

        when(certificacionService.buscarEntreFechas(HOY, HOY.plusDays(90)))
                .thenReturn(List.of(cert));
        when(rolUsuarioService.obtenerRolesUsuarioPorNombreRol(any()))
                .thenReturn(List.of());

        var notificacion = configurarGuardadoExitoso("CERTIFICACION_1_" + dias);

        schedulerService.ejecutarNotificaciones();

        verify(notificacionService).guardarNotificacion(any(NotificacionDTO.class), eq(1), eq("CERTIFICACION_1_" + dias));

        Usuario usuarioEsperado = cert.getIdInvestigador().getIdEmpleado().getIdUsuario();
        verify(notificacionUsuarioService).guardarNotificacionUsuario(
                eq(notificacion),
                eq(usuarioEsperado)
        );
    }

    @ParameterizedTest(name = "No debe generar notificación de certificación próxima a {0} días (día no vigila)")
    @ValueSource(ints = {89, 61, 45, 15, 1})
    void noDeberiaGenerarNotificacion_CertificacionProxima_DiasNoVigila(int dias) {
        var expiracion = HOY.plusDays(dias);
        var cert = mockCertificacion(1, "AWS Solutions Architect", expiracion);

        when(certificacionService.buscarEntreFechas(HOY, HOY.plusDays(90)))
                .thenReturn(List.of(cert));

        schedulerService.ejecutarNotificaciones();

        verify(notificacionService, never()).guardarNotificacion(
                any(NotificacionDTO.class), anyInt(), anyString()
        );
        verify(notificacionUsuarioService, never()).guardarNotificacionUsuario(
                any(Notificacion.class), any(Usuario.class)
        );
    }

    @Test
    void noDeberiaGenerarNotificacion_CertificacionProxima_SiYaExisteHoy() {
        var cert = mockCertificacion(1, "Scrum Master", HOY.plusDays(30));

        when(certificacionService.buscarEntreFechas(any(), any()))
                .thenReturn(List.of(cert));
        when(notificacionService.crearClave(anyString(), anyInt(), anyInt()))
                .thenReturn("CERTIFICACION_1_30");
        when(notificacionService.existeNotificacionHoy("CERTIFICACION_1_30")).thenReturn(true);

        schedulerService.ejecutarNotificaciones();

        verify(notificacionService, never()).guardarNotificacion(
                any(NotificacionDTO.class), anyInt(), anyString()
        );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // CERTIFICACIONES PRÓXIMAS — notificar al investigador + admins + directores
    // ─────────────────────────────────────────────────────────────────────────

    @Test
    void deberiaNotificarInvestigador_Admins_Y_Directores_EnCertificacionProxima() {
        var cert = mockCertificacion(1, "PMP", HOY.plusDays(30));

        when(certificacionService.buscarEntreFechas(any(), any()))
                .thenReturn(List.of(cert));

        var notificacion = configurarGuardadoExitoso("CERTIFICACION_1_30");

        var usuarioAdmin1 = mock(Usuario.class);
        var rolAdmin1     = mock(RolUsuario.class);
        when(rolAdmin1.getIdUsuario()).thenReturn(usuarioAdmin1);

        var usuarioDirector = mock(Usuario.class);
        var rolDirector     = mock(RolUsuario.class);
        when(rolDirector.getIdUsuario()).thenReturn(usuarioDirector);

        when(rolUsuarioService.obtenerRolesUsuarioPorNombreRol("ADMINISTRACION"))
                .thenReturn(List.of(rolAdmin1));
        when(rolUsuarioService.obtenerRolesUsuarioPorNombreRol("DIRECCION"))
                .thenReturn(List.of(rolDirector));

        schedulerService.ejecutarNotificaciones();

        var usuarioInv = cert.getIdInvestigador().getIdEmpleado().getIdUsuario();

        // Deben recibir la notificación: investigador + 1 admin + 1 director = 3 llamadas
        verify(notificacionUsuarioService, times(3))
                .guardarNotificacionUsuario(eq(notificacion), any());

        verify(notificacionUsuarioService).guardarNotificacionUsuario(notificacion, usuarioInv);
        verify(notificacionUsuarioService).guardarNotificacionUsuario(notificacion, usuarioAdmin1);
        verify(notificacionUsuarioService).guardarNotificacionUsuario(notificacion, usuarioDirector);
    }

    @Test
    void siNoHayAdminsNiDirectores_SoloSeNotificaAlInvestigador() {
        var cert = mockCertificacion(1, "Java SE 21", HOY.plusDays(14));

        when(certificacionService.buscarEntreFechas(any(), any()))
                .thenReturn(List.of(cert));
        when(rolUsuarioService.obtenerRolesUsuarioPorNombreRol(any()))
                .thenReturn(List.of());

        var notificacion = configurarGuardadoExitoso("CERTIFICACION_1_14");

        schedulerService.ejecutarNotificaciones();

        // Solo 1 llamada: el investigador
        verify(notificacionUsuarioService, times(1))
                .guardarNotificacionUsuario(eq(notificacion), any());
    }

    // ─────────────────────────────────────────────────────────────────────────
    // CERTIFICACIONES VENCIDAS
    // ─────────────────────────────────────────────────────────────────────────

    @Test
    void deberiaGenerarNotificacion_CertificacionVencida() {
        var vencimiento = HOY.minusDays(5);
        var cert = mockCertificacion(2, "Azure Developer", vencimiento);

        when(certificacionService.buscarVencidas(HOY)).thenReturn(List.of(cert));
        when(rolUsuarioService.obtenerRolesUsuarioPorNombreRol(anyString()))
                .thenReturn(List.of());

        var notificacion = configurarGuardadoExitoso("CERTIFICACION_2_-1");

        schedulerService.ejecutarNotificaciones();

        // Extraer el usuario esperado
        Usuario usuarioEsperado = cert.getIdInvestigador().getIdEmpleado().getIdUsuario();

        verify(notificacionService).guardarNotificacion(
                any(NotificacionDTO.class), eq(2), eq("CERTIFICACION_2_-1")
        );
        verify(notificacionUsuarioService).guardarNotificacionUsuario(
                eq(notificacion), eq(usuarioEsperado)
        );
    }

    @Test
    void noDeberiaGenerarNotificacion_CertificacionVencida_SiYaExisteHoy() {
        var cert = mockCertificacion(2, "Azure Developer", HOY.minusDays(5));

        when(certificacionService.buscarVencidas(any())).thenReturn(List.of(cert));
        when(notificacionService.crearClave(anyString(), anyInt(), anyInt()))
                .thenReturn("CERTIFICACION_2_-1");
        when(notificacionService.existeNotificacionHoy("CERTIFICACION_2_-1")).thenReturn(true);

        schedulerService.ejecutarNotificaciones();

        verify(notificacionService, never()).guardarNotificacion(
                any(NotificacionDTO.class), anyInt(), anyString()
        );
    }

    @Test
    void deberiaNotificarAdminsYDirectores_EnCertificacionVencida() {
        var cert = mockCertificacion(3, "Google Cloud", HOY.minusDays(10));

        when(certificacionService.buscarVencidas(any())).thenReturn(List.of(cert));

        var notificacion = configurarGuardadoExitoso("CERTIFICACION_3_-1");

        var usuarioAdmin = mock(Usuario.class);
        var rolAdmin     = mock(RolUsuario.class);
        when(rolAdmin.getIdUsuario()).thenReturn(usuarioAdmin);

        when(rolUsuarioService.obtenerRolesUsuarioPorNombreRol("ADMINISTRACION"))
                .thenReturn(List.of(rolAdmin));
        when(rolUsuarioService.obtenerRolesUsuarioPorNombreRol("DIRECCION"))
                .thenReturn(List.of());

        schedulerService.ejecutarNotificaciones();

        verify(notificacionUsuarioService, times(2))
                .guardarNotificacionUsuario(eq(notificacion), any());
    }

    // ─────────────────────────────────────────────────────────────────────────
    // MÚLTIPLES CERTIFICACIONES en una misma ejecución
    // ─────────────────────────────────────────────────────────────────────────

    @Test
    void deberiaGenerarNotificaciones_ParaMultiplesCertificaciones() {
        var cert1 = mockCertificacion(1, "AWS", HOY.plusDays(30));
        var cert2 = mockCertificacion(2, "Azure", HOY.plusDays(14));

        when(certificacionService.buscarEntreFechas(any(), any()))
                .thenReturn(List.of(cert1, cert2));
        when(rolUsuarioService.obtenerRolesUsuarioPorNombreRol(any()))
                .thenReturn(List.of());

        when(notificacionService.crearClave(any(), eq(1), any())).thenReturn("CERTIFICACION_1_30");
        when(notificacionService.crearClave(any(), eq(2), any())).thenReturn("CERTIFICACION_2_14");
        when(notificacionService.existeNotificacionHoy(any())).thenReturn(false);

        var notif1 = new Notificacion();
        var notif2 = new Notificacion();
        when(notificacionService.guardarNotificacion(any(), eq(1), any())).thenReturn(notif1);
        when(notificacionService.guardarNotificacion(any(), eq(2), any())).thenReturn(notif2);

        schedulerService.ejecutarNotificaciones();

        verify(notificacionService, times(2)).guardarNotificacion(any(), any(), any());
        verify(notificacionUsuarioService, times(2))
                .guardarNotificacionUsuario(any(), any());
    }

    @Test
    void siNoHayCertificaciones_NoDeberiaGuardarNada() {
        // buscarEntreFechas y buscarVencidas ya devuelven List.of() por el @BeforeEach

        schedulerService.ejecutarNotificaciones();

        verify(notificacionService, never()).guardarNotificacion(any(), any(), any());
        verify(notificacionUsuarioService, never()).guardarNotificacionUsuario(any(), any());
    }
}*/
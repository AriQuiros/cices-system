package org.example.backend_cices_system.service;

import org.example.backend_cices_system.modules.notificacion.repository.NotificacionUsuarioRepository;
import org.example.backend_cices_system.modules.notificacion.dto.NotificacionDTO;
import org.example.backend_cices_system.modules.notificacion.service.NotificacionCambioService;
import org.example.backend_cices_system.modules.notificacion.service.NotificacionService;
import org.example.backend_cices_system.modules.notificacion.service.NotificacionUsuarioService;
import org.example.backend_cices_system.modules.persona.model.Empleado;
import org.example.backend_cices_system.modules.investigador.model.Investigador;
import org.example.backend_cices_system.modules.investigadorProyecto.model.InvestigadorProyecto;
import org.example.backend_cices_system.modules.notificacion.model.Notificacion;
import org.example.backend_cices_system.modules.notificacion.model.NotificacionUsuario;
import org.example.backend_cices_system.modules.investigadorProyecto.model.PermisoProyecto;
import org.example.backend_cices_system.modules.proyecto.model.Proyecto;
import org.example.backend_cices_system.modules.usuario.model.Usuario;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NotificacionUsuarioServiceTest {

    @Mock
    private NotificacionUsuarioRepository notificacionUsuarioRepository;

    @Mock
    private NotificacionService notificacionService;

    @Mock
    private NotificacionCambioService notificacionCambioService;

    private Clock clock;
    private NotificacionUsuarioService notificacionUsuarioService;

    private PermisoProyecto permisoProyecto;
    private Usuario usuario;
    private Notificacion notificacionGuardada;

    @BeforeEach
    void setUp() {
        clock = Clock.fixed(
                Instant.parse("2026-04-17T12:00:00Z"),
                ZoneId.systemDefault()
        );

        notificacionUsuarioService = spy(
                new NotificacionUsuarioService(
                        notificacionUsuarioRepository,
                        notificacionService,
                        notificacionCambioService,
                        clock
                )
        );

        usuario = new Usuario();
        usuario.setId(5);
        usuario.setNombreUsuario("karla.martorell@ucr.ac.cr");

        Empleado empleado = new Empleado();
        empleado.setIdUsuario(usuario);
        empleado.setNombreCompleto("Karla Martorell");
        empleado.setIdentificacion("123456789");

        Investigador investigador = new Investigador();
        investigador.setIdEmpleado(empleado);

        Proyecto proyecto = new Proyecto();
        proyecto.setCodigoProyecto("PR-001");

        InvestigadorProyecto investigadorProyecto = new InvestigadorProyecto();
        investigadorProyecto.setId(10);
        investigadorProyecto.setIdInvestigador(investigador);
        investigadorProyecto.setIdProyecto(proyecto);

        permisoProyecto = new PermisoProyecto();
        permisoProyecto.setId(100);
        permisoProyecto.setIdInvestigadorProyecto(investigadorProyecto);
        permisoProyecto.setFechaInicioPermiso(LocalDate.of(2026, 4, 17));
        permisoProyecto.setFechaFinPermiso(LocalDate.of(2026, 12, 31));

        notificacionGuardada = new Notificacion();
        notificacionGuardada.setId(200);
    }

    @Test
    void guardarNotificacionPermiso_deberiaCrearYAsignarNotificacionAlCoordinador() {
        when(notificacionService.crearClave("PERMISO_COORDINADOR", 100, 0))
                .thenReturn("PERMISO_COORDINADOR-100-0");

        when(notificacionService.guardarNotificacion(
                any(NotificacionDTO.class),
                eq(100),
                eq("PERMISO_COORDINADOR-100-0")
        )).thenReturn(notificacionGuardada);

        NotificacionUsuario notificacionUsuario = new NotificacionUsuario();
        doReturn(notificacionUsuario).when(notificacionUsuarioService)
                .guardarNotificacionUsuario(any(Notificacion.class), any(Usuario.class));

        notificacionUsuarioService.guardarNotificacionPermiso(permisoProyecto);

        ArgumentCaptor<NotificacionDTO> dtoCaptor = ArgumentCaptor.forClass(NotificacionDTO.class);

        verify(notificacionService).guardarNotificacion(
                dtoCaptor.capture(),
                eq(100),
                eq("PERMISO_COORDINADOR-100-0")
        );

        NotificacionDTO dtoEnviado = dtoCaptor.getValue();

        assertNotNull(dtoEnviado);
        assertEquals("PERMISO_COORDINADOR", dtoEnviado.categoria());
        assertEquals("Permiso Coordinador en proyecto 'PR-001'", dtoEnviado.asunto());
        assertEquals(
                "Codigo de proyecto: PR-001; Fecha de inicio: 2026-04-17; Fecha fin: 2026-12-31",
                dtoEnviado.mensaje()
        );
        assertEquals(LocalDate.of(2026, 4, 17), dtoEnviado.fechaCreacion());

        verify(notificacionService).crearClave("PERMISO_COORDINADOR", 100, 0);
        verify(notificacionUsuarioService).guardarNotificacionUsuario(notificacionGuardada, usuario);
    }
}
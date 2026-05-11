package org.example.backend_cices_system.service;

import org.example.backend_cices_system.data.NotificacionUsuarioRepository;
import org.example.backend_cices_system.logic.NotificacionUsuario;
import org.example.backend_cices_system.logic.Usuario;
import org.example.backend_cices_system.report.dao.RepNotificacionesUsuarioRepository;
import org.example.backend_cices_system.report.dto.RepNotificacionDetalladaDTO;
import org.example.backend_cices_system.report.serviceVw.RepNotificacionesUsuarioService;
import org.example.backend_cices_system.report.view.RepNotificacionesUsuario;
import org.example.backend_cices_system.service.NotificacionCambioService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RepNotificacionesUsuarioServiceTest {

    private static final String NOMBRE_USUARIO = "investigador.cypress@ucr.ac.cr";

    @Mock
    private RepNotificacionesUsuarioRepository repo;

    @Mock
    private NotificacionUsuarioRepository notificacionUsuarioRepository;

    @Mock
    private NotificacionCambioService notificacionCambioService;

    @InjectMocks
    private RepNotificacionesUsuarioService service;

    @Test
    void buscarPorNombreUsuario_debeRetornarSoloNotificacionesNoEliminadasDelUsuario() {
        RepNotificacionesUsuario noLeida = crearVista(
                101,
                NOMBRE_USUARIO,
                "Informe pendiente",
                "Codigo de proyecto: CICES-NOT-001",
                "INFORME",
                false,
                false,
                LocalDate.of(2026, 5, 9)
        );

        RepNotificacionesUsuario eliminada = crearVista(
                102,
                NOMBRE_USUARIO,
                "Licencia vencida",
                "Licencia: Permiso biomédico",
                "ACREDITACION_LICENCIA",
                true,
                true,
                LocalDate.of(2026, 4, 1)
        );

        when(repo.findByNombreUsuarioIgnoreCase(NOMBRE_USUARIO))
                .thenReturn(List.of(noLeida, eliminada));

        List<RepNotificacionesUsuario> resultado =
                service.buscarPorNombreUsuario(NOMBRE_USUARIO);

        assertEquals(1, resultado.size());
        assertEquals(101, resultado.getFirst().getIdNotificacionUsuario());
        assertFalse(resultado.getFirst().getEliminado());

        verify(repo).findByNombreUsuarioIgnoreCase(NOMBRE_USUARIO);
    }

    @Test
    void buscarDetalladasPorNombreUsuario_debeMapearNotificacionDeInforme() {
        RepNotificacionesUsuario informe = crearVista(
                101,
                NOMBRE_USUARIO,
                "Informe pendiente",
                "Codigo de proyecto: CICES-NOT-001; Numero de informe: INF-01; Fecha de presentacion: 2026-05-10",
                "INFORME",
                false,
                false,
                LocalDate.of(2026, 5, 9)
        );

        when(repo.findByNombreUsuarioIgnoreCase(NOMBRE_USUARIO))
                .thenReturn(List.of(informe));

        List<RepNotificacionDetalladaDTO> resultado =
                service.buscarDetalladasPorNombreUsuario(NOMBRE_USUARIO);

        assertEquals(1, resultado.size());

        RepNotificacionDetalladaDTO dto = resultado.getFirst();

        assertEquals(101, dto.idNotificacionUsuario());
        assertEquals(NOMBRE_USUARIO, dto.nombreUsuario());
        assertEquals("Informe", dto.tipo());
        assertFalse(dto.leido());
        assertFalse(dto.eliminado());
        assertEquals(LocalDate.of(2026, 5, 9), dto.fechaCreacion());
        assertEquals(LocalDate.of(2026, 5, 10), dto.fechaObjetivo());

        assertEquals("CICES-NOT-001", valorDetalle(dto.detalle(), "Codigo de proyecto"));
        assertEquals("INF-01", valorDetalle(dto.detalle(), "Numero de informe"));
        assertEquals("2026-05-10", valorDetalle(dto.detalle(), "Fecha de presentacion"));
    }

    @Test
    void marcarLeida_debeActualizarEstadoGuardarYNotificarCambio() {
        NotificacionUsuario notificacionUsuario = crearNotificacionUsuario(false, null);

        when(notificacionUsuarioRepository.findByIdAndIdUsuario_NombreUsuarioIgnoreCase(101, NOMBRE_USUARIO))
                .thenReturn(Optional.of(notificacionUsuario));

        service.marcarLeida(101, NOMBRE_USUARIO);

        ArgumentCaptor<NotificacionUsuario> captor =
                ArgumentCaptor.forClass(NotificacionUsuario.class);

        verify(notificacionUsuarioRepository).save(captor.capture());
        verify(notificacionCambioService).notificarCambioUsuario(NOMBRE_USUARIO);

        NotificacionUsuario guardada = captor.getValue();

        assertTrue(guardada.getLeido());
        assertEquals(LocalDate.now(), guardada.getFechaLeido());
    }

    @Test
    void marcarNoLeida_debeActualizarEstadoGuardarYNotificarCambio() {
        NotificacionUsuario notificacionUsuario =
                crearNotificacionUsuario(true, LocalDate.of(2026, 5, 10));

        when(notificacionUsuarioRepository.findByIdAndIdUsuario_NombreUsuarioIgnoreCase(101, NOMBRE_USUARIO))
                .thenReturn(Optional.of(notificacionUsuario));

        service.marcarNoLeida(101, NOMBRE_USUARIO);

        ArgumentCaptor<NotificacionUsuario> captor =
                ArgumentCaptor.forClass(NotificacionUsuario.class);

        verify(notificacionUsuarioRepository).save(captor.capture());
        verify(notificacionCambioService).notificarCambioUsuario(NOMBRE_USUARIO);

        NotificacionUsuario guardada = captor.getValue();

        assertFalse(guardada.getLeido());
        assertNull(guardada.getFechaLeido());
    }

    @Test
    void eliminar_debeMarcarNotificacionComoEliminadaGuardarYNotificarCambio() {
        NotificacionUsuario notificacionUsuario = crearNotificacionUsuario(false, null);
        notificacionUsuario.setEliminado(false);

        when(notificacionUsuarioRepository.findByIdAndIdUsuario_NombreUsuarioIgnoreCase(101, NOMBRE_USUARIO))
                .thenReturn(Optional.of(notificacionUsuario));

        service.eliminar(101, NOMBRE_USUARIO);

        ArgumentCaptor<NotificacionUsuario> captor =
                ArgumentCaptor.forClass(NotificacionUsuario.class);

        verify(notificacionUsuarioRepository).save(captor.capture());
        verify(notificacionCambioService).notificarCambioUsuario(NOMBRE_USUARIO);

        NotificacionUsuario guardada = captor.getValue();

        assertTrue(guardada.getEliminado());
    }

    @Test
    void marcarLeida_debeLanzarErrorSiLaNotificacionNoPerteneceAlUsuario() {
        when(notificacionUsuarioRepository.findByIdAndIdUsuario_NombreUsuarioIgnoreCase(999, NOMBRE_USUARIO))
                .thenReturn(Optional.empty());

        NoSuchElementException exception = assertThrows(
                NoSuchElementException.class,
                () -> service.marcarLeida(999, NOMBRE_USUARIO)
        );

        assertEquals("Notificacion no encontrada para el usuario", exception.getMessage());

        verify(notificacionUsuarioRepository)
                .findByIdAndIdUsuario_NombreUsuarioIgnoreCase(999, NOMBRE_USUARIO);

        verify(notificacionUsuarioRepository, never()).save(any(NotificacionUsuario.class));
        verify(notificacionCambioService, never()).notificarCambioUsuario(anyString());
    }

    private RepNotificacionesUsuario crearVista(
            Integer idNotificacionUsuario,
            String nombreUsuario,
            String asunto,
            String mensaje,
            String categoria,
            Boolean leido,
            Boolean eliminado,
            LocalDate fechaCreacion
    ) {
        RepNotificacionesUsuario vista = new RepNotificacionesUsuario();

        vista.setIdNotificacionUsuario(idNotificacionUsuario);
        vista.setIdUsuario(25);
        vista.setNombreUsuario(nombreUsuario);
        vista.setIdNotificacion(idNotificacionUsuario + 1000);
        vista.setAsunto(asunto);
        vista.setMensaje(mensaje);
        vista.setCategoria(categoria);
        vista.setLeido(leido);
        vista.setEliminado(eliminado);
        vista.setFechaCreacion(fechaCreacion);

        return vista;
    }

    private NotificacionUsuario crearNotificacionUsuario(Boolean leido, LocalDate fechaLeido) {
        Usuario usuario = new Usuario();
        usuario.setId(25);
        usuario.setNombreUsuario(NOMBRE_USUARIO);
        usuario.setActivo(true);

        NotificacionUsuario notificacionUsuario = new NotificacionUsuario();

        notificacionUsuario.setId(101);
        notificacionUsuario.setIdUsuario(usuario);
        notificacionUsuario.setLeido(leido);
        notificacionUsuario.setEliminado(false);
        notificacionUsuario.setFechaLeido(fechaLeido);

        return notificacionUsuario;
    }

    private String valorDetalle(
            List<RepNotificacionDetalladaDTO.CampoDetalleDTO> detalle,
            String label
    ) {
        return detalle.stream()
                .filter(campo -> campo.label().equals(label))
                .findFirst()
                .orElseThrow()
                .value();
    }
}
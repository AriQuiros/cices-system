package org.example.backend_cices_system.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.data.NotificacionUsuarioRepository;
import org.example.backend_cices_system.dto.NotificacionDTO;
import org.example.backend_cices_system.logic.Notificacion;
import org.example.backend_cices_system.logic.NotificacionUsuario;
import org.example.backend_cices_system.logic.PermisoProyecto;
import org.example.backend_cices_system.logic.Usuario;
import org.springframework.stereotype.Service;

import java.time.Clock;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class NotificacionUsuarioService {
    private final NotificacionUsuarioRepository notificacionUsuarioRepository;
    private final NotificacionService notificacionService;
    private final NotificacionCambioService notificacionCambioService;
    private final Clock clock;

    public NotificacionUsuario guardarNotificacionUsuario(Notificacion notificacion, Usuario usuario){
        var notificacionUsuario = new NotificacionUsuario();
        notificacionUsuario.setIdNotificacion(notificacion);

        notificacionUsuario.setIdUsuario(usuario);

        var guardada = notificacionUsuarioRepository.save(notificacionUsuario);
        notificacionCambioService.notificarCambioUsuario(usuario.getNombreUsuario());
        return guardada;
    }

    @Transactional
    public void guardarNotificacionPermiso(PermisoProyecto permisoProyecto){
        var usuario = permisoProyecto.getIdInvestigadorProyecto().getIdInvestigador().getIdEmpleado().getIdUsuario();
        var codigoProyecto = permisoProyecto.getIdInvestigadorProyecto().getIdProyecto().getCodigoProyecto();

        var fechaFin = permisoProyecto.getFechaFinPermiso() != null
                ? permisoProyecto.getFechaFinPermiso().toString()
                : "Indefinido";

        var mensaje = "Codigo de proyecto: " + codigoProyecto
                + "; Fecha de inicio: " + permisoProyecto.getFechaInicioPermiso()
                + "; Fecha fin: " + fechaFin;

        var categoria = "PERMISO_COORDINADOR";
        var clave = notificacionService.crearClave(categoria, permisoProyecto.getId(), 0);

        var notificacion = notificacionService.guardarNotificacion(
                new NotificacionDTO(
                null,
                categoria,
                null,
                "Permiso Coordinador en proyecto '" + codigoProyecto + "'",
                 mensaje,
                 LocalDate.now(clock)
        ),
                permisoProyecto.getId(),
                clave
                );

        guardarNotificacionUsuario(notificacion, usuario);

    }


}
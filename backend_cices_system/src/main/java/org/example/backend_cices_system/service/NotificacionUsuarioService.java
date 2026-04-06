package org.example.backend_cices_system.service;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.data.NotificacionUsuarioRepository;
import org.example.backend_cices_system.dto.NotificacionDTO;
import org.example.backend_cices_system.dto.NotificacionUsuarioDTO;
import org.example.backend_cices_system.dto.UsuarioDTO;
import org.example.backend_cices_system.logic.Notificacion;
import org.example.backend_cices_system.logic.NotificacionUsuario;
import org.example.backend_cices_system.logic.PermisoProyecto;
import org.example.backend_cices_system.logic.Usuario;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificacionUsuarioService {
    private final NotificacionUsuarioRepository notificacionUsuarioRepository;
    private final NotificacionService notificacionService;

    public NotificacionUsuario guardarNotificacionUsuario(Notificacion notificacion, Usuario usuario){
        var notificacionUsuario = new NotificacionUsuario();
        notificacionUsuario.setIdNotificacion(notificacion);

        notificacionUsuario.setIdUsuario(usuario);

       return notificacionUsuarioRepository.save(notificacionUsuario);
    }

    public void guardarNotificacionPermiso(PermisoProyecto permisoProyecto){
        var usuario = permisoProyecto.getIdInvestigadorProyecto().getIdInvestigador().getIdEmpleado().getIdUsuario();
        var codigoProyecto = permisoProyecto.getIdInvestigadorProyecto().getIdProyecto().getCodigoProyecto();

        var mensaje = "Se ha otorgado el permiso 'COORDINADOR' en el proyecto '" + codigoProyecto +
                "' durante el periodo del " + permisoProyecto.getFechaInicioPermiso() + " a";

        mensaje = permisoProyecto.getFechaFinPermiso() != null ?
                mensaje + "l " + permisoProyecto.getFechaInicioPermiso() : mensaje + " indefinido. ";

        var categoria = "PERMISO_COORDINADOR";
        var clave = notificacionService.crearClave(categoria, permisoProyecto.getId(), 0);

        var notificacion = notificacionService.guardarNotificacion(
                new NotificacionDTO(
                null,
                categoria,
                null,
                "Permiso Coordinador en proyecto '" + codigoProyecto + "'",
                 mensaje,
                 LocalDate.now()
        ),
                permisoProyecto.getId(),
                clave
                );

        guardarNotificacionUsuario(notificacion, usuario);

    }


}
package org.example.backend_cices_system.service;

import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.data.NotificacionUsuarioRepository;
import org.example.backend_cices_system.dto.NotificacionDTO;
import org.example.backend_cices_system.dto.NotificacionUsuarioDTO;
import org.example.backend_cices_system.dto.UsuarioDTO;
import org.example.backend_cices_system.logic.Notificacion;
import org.example.backend_cices_system.logic.NotificacionUsuario;
import org.example.backend_cices_system.logic.Usuario;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificacionUsuarioService {
    private final NotificacionUsuarioRepository notificacionUsuarioRepository;
    private final NotificacionService notificacionService;
    private final UsuarioService usuarioService;

    public NotificacionUsuario guardarNotificacionUsuario(Notificacion notificacion, Usuario usuario){
        var notificacionUsuario = new NotificacionUsuario();
        notificacionUsuario.setIdNotificacion(notificacion);

        notificacionUsuario.setIdUsuario(usuario);

       return notificacionUsuarioRepository.save(notificacionUsuario);
    }

    public void guardarNotificacionPermiso(Usuario usuario, String codigoProyecto, String mensaje){
        var notificacion = notificacionService.guardarNotificacion(
                new NotificacionDTO(
                null,
                "PERMISO_COORDINADOR",
                null,
                "Permiso Coordinador en proyecto '" + codigoProyecto + "'",
                 mensaje,
                 LocalDate.now()
        ));

        guardarNotificacionUsuario(notificacion, usuario);

    }

}
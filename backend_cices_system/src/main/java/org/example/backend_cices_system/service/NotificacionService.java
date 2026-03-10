package org.example.backend_cices_system.service;

import jakarta.transaction.Transactional;
import org.example.backend_cices_system.data.NotificacionRepository;
import org.example.backend_cices_system.data.NotificacionUsuarioRepository;
import org.example.backend_cices_system.dto.NotificacionDTO;
import org.example.backend_cices_system.dto.UsuarioDTO;
import org.example.backend_cices_system.logic.Notificacion;
import org.example.backend_cices_system.logic.NotificacionUsuario;
import org.springframework.stereotype.Service;

@Service
public class NotificacionService {
    private final NotificacionRepository notificacionRepository;
    private final NotificacionUsuarioRepository notificacionUsuarioRepository;
    private final CatalogoService catalogoService;
    private final AuthService authService;

    public NotificacionService(NotificacionRepository notificacionRepository, AuthService authService,
                               NotificacionUsuarioRepository notificacionUsuarioRepository, CatalogoService catalogoService) {
        this.catalogoService = catalogoService;
        this.authService = authService;
        this.notificacionRepository = notificacionRepository;
        this.notificacionUsuarioRepository = notificacionUsuarioRepository;
    }

    @Transactional
    public Notificacion guardarNotificacion(NotificacionDTO notificacionDTO) {
        var notificacion = new Notificacion();
        notificacion.setIdCodigoTipoCategoria(notificacionDTO.categoria().id());
        notificacion.setIdCodigoTipoPrioridad(notificacionDTO.prioridad().id());
        notificacion.setAsunto(notificacionDTO.asunto());
        notificacion.setMensaje(notificacionDTO.mensaje());
        notificacion.setFechaCreacion(notificacionDTO.fechaCreacion());

        notificacionRepository.save(notificacion);

        for(UsuarioDTO usuarioDTO : notificacionDTO.usuarios()) {
            var notificacionUsuario = new NotificacionUsuario();
            notificacionUsuario.setIdNotificacion(notificacion);

            var usuario = authService.obtenerXNombreUsuario(usuarioDTO.nombreUsuario());
            notificacionUsuario.setIdUsuario(usuario);

            notificacionUsuarioRepository.save(notificacionUsuario);
        }

        return notificacion;
    }
}

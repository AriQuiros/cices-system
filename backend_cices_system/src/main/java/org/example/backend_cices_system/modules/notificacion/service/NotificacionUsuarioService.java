package org.example.backend_cices_system.modules.notificacion.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.backend_cices_system.modules.notificacion.repository.NotificacionUsuarioRepository;
import org.example.backend_cices_system.modules.notificacion.model.Notificacion;
import org.example.backend_cices_system.modules.notificacion.model.NotificacionUsuario;
import org.example.backend_cices_system.modules.usuario.model.Usuario;
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

    public void guardarNotificacionUsuario(Notificacion notificacion, Usuario usuario){
        var notificacionUsuario = new NotificacionUsuario();
        notificacionUsuario.setIdNotificacion(notificacion);

        notificacionUsuario.setIdUsuario(usuario);

                // Asegurar estado inicial: no leída y no eliminada
                notificacionUsuario.setLeido(Boolean.FALSE);
                notificacionUsuario.setEliminado(Boolean.FALSE);

                var guardada = notificacionUsuarioRepository.save(notificacionUsuario);
        notificacionCambioService.notificarCambioUsuario(usuario.getNombreUsuario());
    }

    private NotificacionUsuario obtenerNotificacionUsuarioPorIdYUsuario(Integer id, Usuario usuario){
        return notificacionUsuarioRepository.findByIdAndIdUsuario(id, usuario).orElseThrow(() ->
                new RuntimeException("No se encontró la notificación para el usuario")
        );
    }

    @Transactional
    public void marcarLeida(Integer idNotificacionUsuario, Usuario usuario) {
        NotificacionUsuario notificacionUsuario = obtenerNotificacionUsuarioPorIdYUsuario(idNotificacionUsuario, usuario);
        notificacionUsuario.setLeido(true);
        notificacionUsuario.setFechaLeido(LocalDate.now());
        notificacionUsuarioRepository.save(notificacionUsuario);
        notificacionCambioService.notificarCambioUsuario(usuario.getNombreUsuario());
    }

    @Transactional
    public void marcarNoLeida(Integer idNotificacionUsuario, Usuario usuario) {
        NotificacionUsuario notificacionUsuario = obtenerNotificacionUsuarioPorIdYUsuario(idNotificacionUsuario, usuario);
        notificacionUsuario.setLeido(false);
        notificacionUsuario.setFechaLeido(null);
        notificacionUsuarioRepository.save(notificacionUsuario);
        notificacionCambioService.notificarCambioUsuario(usuario.getNombreUsuario());
    }
    @Transactional
    public void eliminar(Integer idNotificacionUsuario, Usuario usuario) {
        // Verificar que la notificación pertenece al usuario antes de borrar
        obtenerNotificacionUsuarioPorIdYUsuario(idNotificacionUsuario, usuario);
        notificacionUsuarioRepository.deleteById(idNotificacionUsuario);
        notificacionCambioService.notificarCambioUsuario(usuario.getNombreUsuario());
    }



}
package org.example.backend_cices_system.modules.notificacion.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class NotificacionCambioService {

    private static final Logger log = LoggerFactory.getLogger(NotificacionCambioService.class);

    // Un emitter activo por usuario (si abre otra pestaña reemplaza el anterior)
    private final Map<String, SseEmitter> emittersPorUsuario = new ConcurrentHashMap<>();

    public SseEmitter suscribir(String nombreUsuario) {
        String clave = normalizar(nombreUsuario);

        // Si había uno anterior, completarlo para limpiar recursos
        SseEmitter anterior = emittersPorUsuario.remove(clave);
        if (anterior != null) {
            try { anterior.complete(); } catch (Exception ignored) {}
        }

        SseEmitter emitter = new SseEmitter(0L); // sin timeout — el cliente reconecta si pierde conexión

        emitter.onCompletion(() -> emittersPorUsuario.remove(clave));
        emitter.onTimeout(()    -> emittersPorUsuario.remove(clave));
        emitter.onError(e ->    emittersPorUsuario.remove(clave));

        emittersPorUsuario.put(clave, emitter);

        // Enviar evento inicial para confirmar suscripción
        try {
            emitter.send(SseEmitter.event().name("conectado").data("ok"));
        } catch (IOException e) {
            emittersPorUsuario.remove(clave);
        }

        log.debug("SSE suscrito para usuario '{}'", nombreUsuario);
        return emitter;
    }

    public void notificarCambioUsuario(String nombreUsuario) {
        SseEmitter emitter = emittersPorUsuario.get(normalizar(nombreUsuario));
        if (emitter == null) return;

        try {
            emitter.send(SseEmitter.event().name("cambio").data("actualizar"));
        } catch (IOException e) {
            emittersPorUsuario.remove(normalizar(nombreUsuario));
            log.debug("Emitter cerrado para usuario '{}' al notificar", nombreUsuario);
        }
    }

    private String normalizar(String nombre) {
        return nombre == null ? "" : nombre.trim().toLowerCase();
    }
}
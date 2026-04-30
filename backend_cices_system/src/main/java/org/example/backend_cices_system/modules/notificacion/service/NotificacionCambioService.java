package org.example.backend_cices_system.modules.notificacion.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.async.DeferredResult;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class NotificacionCambioService {

    private static final Logger log = LoggerFactory.getLogger(NotificacionCambioService.class);

    private static final long TIMEOUT_MS = 60_000L;

    private final Map<String, List<DeferredResult<ResponseEntity<Void>>>> listenersPorUsuario = new ConcurrentHashMap<>();

    public DeferredResult<ResponseEntity<Void>> esperarCambios(String nombreUsuario) {
        String claveUsuario = normalizarUsuario(nombreUsuario);

        try {
            DeferredResult<ResponseEntity<Void>> deferred = new DeferredResult<>(TIMEOUT_MS);
            deferred.onTimeout(() -> deferred.setResult(ResponseEntity.noContent().build()));
            deferred.onCompletion(() -> removerListener(claveUsuario, deferred));

            listenersPorUsuario
                .computeIfAbsent(claveUsuario, key -> new CopyOnWriteArrayList<>())
                    .add(deferred);

            log.debug("Esperando cambios para usuario='{}' (clave='{}')", nombreUsuario, claveUsuario);
            return deferred;
        } catch (Throwable t) {
            log.error("Error en esperarCambios para usuario='{}'", nombreUsuario, t);
            DeferredResult<ResponseEntity<Void>> failed = new DeferredResult<>();
            failed.setResult(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build());
            return failed;
        }
    }

    public void notificarCambioUsuario(String nombreUsuario) {
        String claveUsuario = normalizarUsuario(nombreUsuario);
        List<DeferredResult<ResponseEntity<Void>>> listeners = listenersPorUsuario.remove(claveUsuario);

        if (listeners == null || listeners.isEmpty()) {
            return;
        }

        for (DeferredResult<ResponseEntity<Void>> deferred : listeners) {
            try {
                deferred.setResult(ResponseEntity.status(HttpStatus.OK).build());
            } catch (Throwable t) {
                log.warn("Fallo notificando listener para usuario='{}'", nombreUsuario, t);
            }
        }
    }

    private String normalizarUsuario(String nombreUsuario) {
        return nombreUsuario == null ? "" : nombreUsuario.trim().toLowerCase();
    }

    private void removerListener(String claveUsuario, DeferredResult<ResponseEntity<Void>> deferred) {
        List<DeferredResult<ResponseEntity<Void>>> listeners = listenersPorUsuario.get(claveUsuario);
        if (listeners == null) {
            return;
        }

        listeners.remove(deferred);
        if (listeners.isEmpty()) {
            listenersPorUsuario.remove(claveUsuario);
        }
    }
}
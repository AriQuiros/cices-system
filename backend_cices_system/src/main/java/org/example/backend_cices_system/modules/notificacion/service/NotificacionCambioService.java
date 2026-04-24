package org.example.backend_cices_system.modules.notificacion.service;

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

    private static final long TIMEOUT_MS = 60_000L;

    private final Map<String, List<DeferredResult<ResponseEntity<Void>>>> listenersPorUsuario = new ConcurrentHashMap<>();

    public DeferredResult<ResponseEntity<Void>> esperarCambios(String nombreUsuario) {
        String claveUsuario = normalizarUsuario(nombreUsuario);

        DeferredResult<ResponseEntity<Void>> deferred = new DeferredResult<>(TIMEOUT_MS);
        deferred.onTimeout(() -> deferred.setResult(ResponseEntity.noContent().build()));
        deferred.onCompletion(() -> removerListener(claveUsuario, deferred));

        listenersPorUsuario
            .computeIfAbsent(claveUsuario, key -> new CopyOnWriteArrayList<>())
                .add(deferred);

        return deferred;
    }

    public void notificarCambioUsuario(String nombreUsuario) {
        String claveUsuario = normalizarUsuario(nombreUsuario);
        List<DeferredResult<ResponseEntity<Void>>> listeners = listenersPorUsuario.remove(claveUsuario);

        if (listeners == null || listeners.isEmpty()) {
            return;
        }

        for (DeferredResult<ResponseEntity<Void>> deferred : listeners) {
            deferred.setResult(ResponseEntity.status(HttpStatus.OK).build());
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
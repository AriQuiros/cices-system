import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { NOTIFICACIONES_KEY } from "./queries/useNotificaciones.js";

/**
 * Suscribe un SSE al backend.
 * Cuando el servidor envía el evento "cambio", invalida automáticamente
 * la query de notificaciones → React Query recarga sin que el usuario haga nada.
 */
export const useSseNotificaciones = (token) => {
    const qc = useQueryClient();

    useEffect(() => {
        if (!token) return;

        let activo = true;
        let reader = null;

        const conectar = async () => {
            try {
                const res = await fetch("/api/consulta/notificaciones-usuario/suscribir", {
                    headers: { Authorization: `Bearer ${token}` },
                    cache: "no-store"
                });

                if (!res.ok || !res.body) return;

                reader = res.body.getReader();
                const decoder = new TextDecoder();

                while (activo) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const texto = decoder.decode(value);
                    if (texto.includes("event: cambio")) {
                        qc.invalidateQueries({ queryKey: [NOTIFICACIONES_KEY] });
                    }
                }
            } catch {
                // La conexión SSE se cortó — el backend reconectará al navegar
            }
        };

        conectar();

        return () => {
            activo = false;
            reader?.cancel?.();
        };
    }, [token, qc]);
};
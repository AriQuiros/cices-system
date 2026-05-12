import httpClient from "../../core/api/httpClient.js";

export const listarNotificaciones = (filtro, pageable) =>
    httpClient.get("/consulta/notificaciones-usuario/listar", {
        params: {
            ...filtro,
            page: pageable?.page ?? 0,
            size: pageable?.size ?? 10
        }
    });

export const contarNoLeidas = () =>
    httpClient.get("/consulta/notificaciones-usuario/no-leidas/count");

export const marcarLeida = (id) =>
    httpClient.put(`/notificacion-usuario/leido/${id}`);

export const marcarNoLeida = (id) =>
    httpClient.put(`/notificacion-usuario/no-leido/${id}`);

export const eliminarNotificacion = (id) =>
    httpClient.delete(`/notificacion-usuario/eliminar/${id}`);
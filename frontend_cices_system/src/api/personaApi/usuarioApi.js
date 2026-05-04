import httpClient from "../../core/api/httpClient.js";

// cambiar estado del usuario
export const cambiarEstadoUsuario = (id, activo) => {
    return httpClient.put(`/usuarios/${id}/estado`, {
        activo
    });
};
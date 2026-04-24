import httpClient from "../../../core/api/httpClient";

// obtener permisos por proyecto
export const obtenerPermisosPorProyecto = (codigoProyecto) => {
    return httpClient.get(`/permiso-proyecto/obtener/${codigoProyecto}`);
};

// otorgar permiso
export const otorgarPermisoProyecto = (permiso) => {
    return httpClient.post("/permiso-proyecto/otorgar", permiso);
};

// remover permiso
export const removerPermisoProyecto = (id) => {
    return httpClient.delete(`/permiso-proyecto/remover/${id}`);
};
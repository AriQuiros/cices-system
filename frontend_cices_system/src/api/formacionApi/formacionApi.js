// src/modules/formacion/api/formacionApi.js
import httpClient from "../../core/api/httpClient.js";

// eliminar certificación
export const eliminarCertificacion = (id) => {
    return httpClient.delete(`/certificaciones/eliminar/${id}`);
};

// eliminar título
export const eliminarTitulo = (id) => {
    return httpClient.delete(`/titulos/eliminar/${id}`);
};

// filtrar certificaciones — rol admin/director/asistente
export const filtrarCertificaciones = (filtro, pageable) => {
    return httpClient.get("/consulta/certificaciones/filtrar", {
        params: {
            ...filtro,
            page: pageable.page,
            size: pageable.size
        }
    });
};

// mis certificaciones — rol investigador (el backend saca el id del JWT)
export const misCertificaciones = (filtro, pageable) => {
    return httpClient.get("/consulta/certificaciones/investigador", {
        params: {
            ...filtro,
            page: pageable.page,
            size: pageable.size
        }
    });
};
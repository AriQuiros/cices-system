import httpClient from "../../../core/api/httpClient";

// eliminar certificación
export const eliminarCertificacion = (id) => {
    return httpClient.delete(`/certificaciones/eliminar/${id}`);
};

// eliminar título
export const eliminarTitulo = (id) => {
    return httpClient.delete(`/titulos/eliminar/${id}`);
};

// filtrar certificaciones
export const filtrarCertificaciones = (filtro, page, size) => {
    return httpClient.get("/consulta/certificaciones/filtrar",  {
        params: {
            ... filtro,
            page,
            size
        }
    });
};

// mis certificaciones
export const misCertificaciones = (filtro, pageable) => {
    return httpClient.get(
        "/consulta/certificaciones/investigador",
        {
            params: {
                ...filtro,
                page: pageable.page,
                size: pageable.size
            }
        }
    );
};
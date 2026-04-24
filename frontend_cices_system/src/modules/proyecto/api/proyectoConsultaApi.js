import httpClient from "../../../core/api/httpClient";

export const listarProyectos = (filtro, pageable) => {
    return httpClient.get("/consulta/proyectos/listar", {
        params: {
            ...filtro,
            page: pageable.page,
            size: pageable.size,
            sort: pageable.sort
        }
    });
};

export const buscarCodigoNombreFechas = (texto, pageable) => {
    return httpClient.get("/consulta/proyectos/busqueda", {
        params: {
            texto,
            page: pageable.page,
            size: pageable.size
        }
    });
};

export const obtenerProyectoReporte = (idProyecto) => {
    return httpClient.get(`/consulta/proyectos/${idProyecto}`);
};
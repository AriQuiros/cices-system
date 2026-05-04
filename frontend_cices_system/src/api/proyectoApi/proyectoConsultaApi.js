import httpClient from "../../core/api/httpClient.js";

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

export const obtenerProyectoReporte = (codigoProyecto) => {
    return httpClient.get(`/consulta/proyectos/${encodeURIComponent(codigoProyecto)}`);
};

export const fetchDocumentoBlob = (idDocumento, mode = "descargar") => {
    return httpClient.get(`/documentos/${idDocumento}/${mode}`, {
        responseType: "blob"
    });
};

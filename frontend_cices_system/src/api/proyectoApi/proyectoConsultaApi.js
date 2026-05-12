import httpClient from "../../core/api/httpClient.js";

export const listarProyectos = (filtro, pageable) => {
    const params = new URLSearchParams();

    if (filtro.texto) params.append("texto", filtro.texto);
    if (filtro.estado) params.append("estado", filtro.estado);
    if (filtro.ordenFecha) params.append("ordenFecha", filtro.ordenFecha);

    filtro.lineas?.forEach(l => params.append("lineas", l));
    filtro.tipos?.forEach(t => params.append("tipos", t));

    params.append("page", pageable.page);
    params.append("size", pageable.size);

    if (pageable.sort) {
        params.append("sort", pageable.sort);
    }

    return httpClient.get("/consulta/proyectos/listar", {
        params
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

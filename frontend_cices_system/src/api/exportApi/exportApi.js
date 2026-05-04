import httpClient from "../../core/api/httpClient.js";

export const exportarCertificaciones = (filtro, formato) => {
    return httpClient.get("/exportar/reporte-certificaciones", {
        params: {
            ...filtro,
            formato
        },
        responseType: "blob"
    });
};

export const exportarProyectos = (filtro, formato) => {
    return httpClient.get("/exportar/reporte-proyectos", {
        params: {
            ...filtro,
            formato
        },
        responseType: "blob" 
    });
};
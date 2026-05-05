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

export const exportarParticipantes = (filtro, formato) => {
    return httpClient.get("/exportar/reporte-participantes", {
        params: { ...filtro, formato },
        responseType: "blob"
    });
};

export const exportarPresupuestos = (filtro, formato) => {
    return httpClient.get("/exportar/reporte-presupuestos", {
        params: { ...filtro, formato },
        responseType: "blob"
    });
};
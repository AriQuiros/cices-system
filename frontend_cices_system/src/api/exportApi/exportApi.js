import httpClient from "../../core/api/httpClient.js";
import qs from "qs";

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

export const exportarPresupuestos = (filtroProyecto, filtroPresupuesto, formato) => {
    return httpClient.get("/exportar/reporte-presupuestos", {
        params: { ...filtroProyecto, ...filtroPresupuesto, formato },
        paramsSerializer: params => qs.stringify(params, { arrayFormat: "repeat" }),
        responseType: "blob"
    });
};
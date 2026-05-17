import httpClient from "../../core/api/httpClient.js";
import qs from "qs";

export const listarParticipantes = (filtro, pageable, limite) => {
    return httpClient.get("/exportar/listar-participantes", {
        params: {
            ...filtro,
            page: pageable.page,
            size: pageable.size,
            limite
        }
    });
};

export const listarPresupuestosReporte = (filtroProyecto, filtroPresupuesto, pageable, limite) => {
    return httpClient.get("/exportar/listar-presupuestos", {
        params: {
            ...filtroProyecto,
            ...filtroPresupuesto,
            page: pageable.page,
            size: pageable.size,
            limite
        },
        paramsSerializer: params => qs.stringify(params, { arrayFormat: "repeat" })
    });
};
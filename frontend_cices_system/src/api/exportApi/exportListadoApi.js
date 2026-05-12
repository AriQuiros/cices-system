import httpClient from "../../core/api/httpClient.js";

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
        }
    });
};
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

export const listarPresupuestosReporte = (filtro, pageable, limite) => {
    return httpClient.get("/exportar/listar-presupuestos", {
        params: {
            ...filtro,
            page: pageable.page,
            size: pageable.size,
            limite
        }
    });
};
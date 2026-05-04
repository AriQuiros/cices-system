import httpClient from "../../core/api/httpClient.js";

// bitácora de cambios
export const obtenerBitacoraGasto = (idGasto) => {
    return httpClient.get(`/gasto-bit/gasto/${idGasto}`);
};
import httpClient from "../../../core/api/httpClient";

// bitácora de cambios
export const obtenerBitacoraGasto = (idGasto) => {
    return httpClient.get(`/gasto-bit/gasto/${idGasto}`);
};
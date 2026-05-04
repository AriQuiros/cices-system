import httpClient from "../../core/api/httpClient.js";

export const obtenerBitacoraPresupuesto = (idPresupuesto) => {
    return httpClient.get(`/presupuesto-bit/presupuesto/${idPresupuesto}`);
};
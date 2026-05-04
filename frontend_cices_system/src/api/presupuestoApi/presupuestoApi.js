import httpClient from "../../core/api/httpClient.js";

// registrar lista de presupuestos a proyecto
export const registrarPresupuesto = (codigoProyecto, listDto) => {
    return httpClient.post(`/presupuestos/${codigoProyecto}/registrar`, listDto);
};

// actualizar uno
export const actualizarPresupuesto = (dto) => {
    return httpClient.post("/presupuestos/actualizar", dto);
};

// obtener uno simple
export const obtenerPresupuesto = (id) => {
    return httpClient.get(`/presupuestos/obtener/${id}`);
};
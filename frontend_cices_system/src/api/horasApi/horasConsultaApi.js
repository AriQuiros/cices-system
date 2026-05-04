import httpClient from "../../core/api/httpClient.js";

// horas por presupuesto
export const obtenerHorasPorPresupuesto = (idPresupuesto, pageable, ordenarPor, direccion) => {
    return httpClient.get(`/consulta/horas-asignadas/${idPresupuesto}`, {
        params: {
            page: pageable.page,
            size: pageable.size,
            ordenarPor,
            direccion
        }
    });
};
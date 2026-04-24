import httpClient from "../../../core/api/httpClient";

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
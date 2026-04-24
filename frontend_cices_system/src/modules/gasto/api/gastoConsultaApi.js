import httpClient from "../../../core/api/httpClient";

// gastos por presupuesto paginado
export const obtenerGastosPorPresupuesto = (idPresupuesto, pageable, ordenarPor, direccion) => {
    return httpClient.get(`/consulta/gastos/${idPresupuesto}`, {
        params: {
            page: pageable.page,
            size: pageable.size,
            ordenarPor,
            direccion
        }
    });
};
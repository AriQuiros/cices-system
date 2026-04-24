import httpClient from "../../../core/api/httpClient";

// detalle completo
export const obtenerPresupuestoReporte = (idPresupuesto) => {
    return httpClient.get(`/consulta/presupuestos/${idPresupuesto}`);
};

// búsqueda ligera
export const buscarPresupuestos = (filtro, pageable) => {
    return httpClient.get(`/consulta/presupuestos/busqueda`, {
        params: {
            ...filtro,
            page: pageable.page,
            size: pageable.size
        }
    });
};

// presupuestos por proyecto con tipo + sublistas
export const presupuestosPorProyectoTipo = (
    filtro,
    ordenamiento,
    pageable
) => {
    return httpClient.get("/consulta/presupuestos/tipo/proyecto", {
        params: {
            ...filtro,
            ...ordenamiento,
            page: pageable.page,
            size: pageable.size
        }
    });
};

// presupuestos por proyecto simple
export const presupuestosPorProyecto = (
    filtro,
    ordenamiento,
    pageable
) => {
    return httpClient.get("/consulta/presupuestos/proyecto", {
        params: {
            ...filtro,
            ...ordenamiento,
            page: pageable.page,
            size: pageable.size
        }
    });
};
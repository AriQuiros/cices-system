import httpClient from "../../../core/api/httpClient";

// proyectos del investigador (ligero)
export const obtenerProyectosInvestigador = (texto, soloPrincipalOPermiso, pageable) => {
    return httpClient.get("/consulta/investigador-proyecto/busqueda", {
        params: {
            texto,
            soloPrincipalOPermiso,
            page: pageable.page,
            size: pageable.size
        }
    });
};

// listado completo investigador-proyecto
export const listarInvestigadorProyecto = (filtro, filtroInv, pageable) => {
    return httpClient.get("/consulta/investigador-proyecto/listar", {
        params: {
            ...filtro,
            ...filtroInv,
            page: pageable.page,
            size: pageable.size
        }
    });
};

// investigadores por proyecto
export const obtenerInvestigadoresPorProyecto = (codigoProyecto, pageable, ordenPor, direccion) => {
    return httpClient.get(`/consulta/investigador-proyecto/${codigoProyecto}`, {
        params: {
            page: pageable.page,
            size: pageable.size,
            ordenPor,
            direccion
        }
    });
};
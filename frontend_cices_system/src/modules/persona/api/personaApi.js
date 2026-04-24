import httpClient from "../../../core/api/httpClient";

export const obtenerEmpleados = (filtro, pageable) => {
    return httpClient.get("/consulta/personas/empleados", {
        params: {
            ...filtro,
            page: pageable.page,
            size: pageable.size
        }
    });
};

export const obtenerInvestigadores = (filtro, pageable) => {
    return httpClient.get("/consulta/personas/investigadores", {
        params: {
            ...filtro,
            page: pageable.page,
            size: pageable.size
        }
    });
};

export const obtenerUsuarios = (filtro, pageable) => {
    return httpClient.get("/consulta/personas/usuarios", {
        params: {
            ...filtro,
            page: pageable.page,
            size: pageable.size
        }
    });
};
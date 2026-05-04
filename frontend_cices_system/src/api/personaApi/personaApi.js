import httpClient from "../../core/api/httpClient.js";
import qs from "qs";

export const obtenerEmpleados = (filtro, pageable) => {
    return httpClient.get("/consulta/personas/empleados", {
        params: {
            ...filtro,
            page: pageable.page,
            size: pageable.size
        },
        paramsSerializer: params =>
            qs.stringify(params, { arrayFormat: "repeat" })
    });
};

export const obtenerInvestigadores = (filtro, pageable) => {
    return httpClient.get("/consulta/personas/investigadores", {
        params: {
            ...filtro,
            page: pageable.page,
            size: pageable.size
        },
        paramsSerializer: params =>
            qs.stringify(params, { arrayFormat: "repeat" })
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

export const obtenerInvestigadorDetalle = (identificacion) => {
    return httpClient.get(`/consulta/personas/investigador/${identificacion}`);
};
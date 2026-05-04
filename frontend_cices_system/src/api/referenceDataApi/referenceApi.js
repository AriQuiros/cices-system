import httpClient from "../../core/api/httpClient.js";

/* =========================
   RESUMEN EJECUTIVO
========================= */
export const obtenerResumenEjecutivo = () => {
    return httpClient.get("/resumen-ejecutivo");
};

/* =========================
   ROLES SISTEMA
========================= */
export const obtenerRolesSistema = () => {
    return httpClient.get("/rol-sistema");
};

/* =========================
   ROLES PROYECTO
========================= */
export const obtenerRolesProyecto = () => {
    return httpClient.get("/rol-proyecto/roles");
};

/* =========================
   CATÁLOGOS
========================= */
export const obtenerCatalogosPorTipos = (tipos) => {
    return httpClient.post("/catalogos/tipos", tipos);
};

/* =========================
   ENTIDADES
========================= */
export const buscarEntidades = (nombre, tipo = "INSTITUCION") => {
    return httpClient.get("/entidades/buscar", {
        params: { nombre, tipo }
    });
};
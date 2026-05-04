import httpClient from "../../core/api/httpClient.js";

// registrar horas
export const registrarHoras = (listDto) => {
    return httpClient.post("/horas-asignadas/registro", listDto);
};

// actualizar hora
export const actualizarHora = (dto) => {
    return httpClient.put("/horas-asignadas/actualizar", dto);
};

// eliminar hora
export const eliminarHora = (id) => {
    return httpClient.delete(`/horas-asignadas/eliminar/${id}`);
};

// obtener hora
export const obtenerHora = (id) => {
    return httpClient.get(`/horas-asignadas/obtener/${id}`);
};
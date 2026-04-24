import httpClient from "../../../core/api/httpClient";

// asignar investigadores a proyectos
export const asignarInvestigadorProyecto = (listDto) => {
    return httpClient.post("/investigador-proyecto/registro", listDto);
};

// actualizar asignación
export const actualizarInvestigadorProyecto = (dto) => {
    return httpClient.put("/investigador-proyecto/actualizar", dto);
};

// eliminar asignación
export const eliminarInvestigadorProyecto = (id) => {
    return httpClient.delete(`/investigador-proyecto/eliminar/${id}`);
};

// obtener asignación
export const obtenerInvestigadorProyecto = (id) => {
    return httpClient.get(`/investigador-proyecto/obtener/${id}`);
};
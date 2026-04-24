import httpClient from "../../../core/api/httpClient";

// registrar lista de gastos
export const registrarGasto = (listDto) => {
    return httpClient.post("/gastos/registro", listDto);
};

// actualizar gasto
export const actualizarGasto = (dto) => {
    return httpClient.put("/gastos/actualizar", dto);
};

// eliminar gasto
export const eliminarGasto = (id) => {
    return httpClient.delete(`/gastos/eliminar/${id}`);
};

// obtener gasto
export const obtenerGasto = (id) => {
    return httpClient.get(`/gastos/obtener/${id}`);
};
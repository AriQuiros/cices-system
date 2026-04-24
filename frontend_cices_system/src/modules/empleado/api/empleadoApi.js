import httpClient from "../../../core/api/httpClient";

export const crearEmpleado = (dto) => {
    return httpClient.post("/empleados/registro", dto);
};

export const obtenerPerfilEmpleado = () => {
    return httpClient.get("/empleados/perfil");
};

export const actualizarEmpleado = (dto) => {
    return httpClient.put("/empleados/actualizar", dto);
};
import httpClient from "../../core/api/httpClient.js";

export const crearInvestigador = (dto) => {
    return httpClient.post("/investigadores/registro", dto);
};

export const buscarInvestigadores = (nombre) => {
    return httpClient.get("/investigadores", {
        params: { nombre }
    });
};

export const obtenerPerfilInvestigador = () => {
    return httpClient.get("/investigadores/perfil");
};

export const actualizarInvestigador = (dto) => {
    return httpClient.put("/investigadores/actualizar", dto);
};
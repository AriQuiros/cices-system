import httpClient from "../../../core/api/httpClient";

export const crearProyecto = (formData) => {
    return httpClient.post("/proyectos/guardar", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
};

export const obtenerLineasInvestigacion = () => {
    return httpClient.get("/proyectos/lineas-investigacion");
};
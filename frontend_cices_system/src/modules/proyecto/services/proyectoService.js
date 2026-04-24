import {
    crearProyecto,
    obtenerLineasInvestigacion
} from "../api/proyectoApi";

export const guardarProyecto = async (dto, documentos) => {
    const formData = new FormData();

    formData.append(
        "proyecto",
        new Blob([JSON.stringify(dto)], { type: "application/json" })
    );

    if (documentos) {
        documentos.forEach(doc => {
            formData.append("documentos", doc);
        });
    }

    const res = await crearProyecto(formData);
    return res.data;
};

export const obtenerLineas = async () => {
    const res = await obtenerLineasInvestigacion();
    return res.data;
};
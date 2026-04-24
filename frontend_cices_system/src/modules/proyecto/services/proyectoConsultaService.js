import {
    listarProyectos,
    buscarCodigoNombreFechas,
    obtenerProyectoReporte
} from "../api/proyectoConsultaApi";

export const obtenerProyectos = async (filtro, pageable) => {
    const res = await listarProyectos(filtro, pageable);
    return res.data;
};

export const buscarProyectosResumen = async (texto, pageable) => {
    const res = await buscarCodigoNombreFechas(texto, pageable);
    return res.data;
};

export const obtenerProyectoDetalleReporte = async (idProyecto) => {
    const res = await obtenerProyectoReporte(idProyecto);
    return res.data;
};
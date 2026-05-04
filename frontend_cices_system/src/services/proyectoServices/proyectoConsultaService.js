import {
    listarProyectos,
    buscarCodigoNombreFechas,
    obtenerProyectoReporte
} from "../../api/proyectoApi/proyectoConsultaApi.js";

export const obtenerProyectos = async (filtro, pageable) => {
    const res = await listarProyectos(filtro, pageable);
    return res.data;
};

export const buscarProyectosResumen = async (texto, pageable) => {
    const res = await buscarCodigoNombreFechas(texto, pageable);
    return res.data;
};

export const obtenerProyectoReportePorCodigo = async (codigoProyecto) => {
    const res = await obtenerProyectoReporte(codigoProyecto);
    return res.data;
};
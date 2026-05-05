import {
    listarParticipantes,
    listarPresupuestosReporte
} from "../../api/exportApi/exportListadoApi.js";

export const listarParticipantesSrv = async (filtro, pageable, limite) => {
    const res = await listarParticipantes(filtro, pageable, limite);
    return res.data;
};

export const listarPresupuestosReporteSrv = async (filtro, pageable, limite) => {
    const res = await listarPresupuestosReporte(filtro, pageable, limite);
    return res.data;
};
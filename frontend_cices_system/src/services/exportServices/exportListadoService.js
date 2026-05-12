import {
    listarParticipantes,
    listarPresupuestosReporte
} from "../../api/exportApi/exportListadoApi.js";

export const listarParticipantesSrv = async (filtro, pageable, limite) => {
    const res = await listarParticipantes(filtro, pageable, limite);
    return res.data;
};

export const listarPresupuestosReporteSrv = async (filtroProyecto, filtroPresupuesto, pageable, limite) => {
    const res = await listarPresupuestosReporte(filtroProyecto, filtroPresupuesto, pageable, limite);
    return res.data;
};
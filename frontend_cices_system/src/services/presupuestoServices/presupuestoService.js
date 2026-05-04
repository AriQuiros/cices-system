import {
    registrarPresupuesto,
    actualizarPresupuesto,
    obtenerPresupuesto
} from "../../api/presupuestoApi/presupuestoApi.js";

export const guardarPresupuestos = async (codigoProyecto, lista) => {
    const res = await registrarPresupuesto(codigoProyecto, lista);
    return res.data; // cantidad
};

export const actualizarPresupuestoSrv = async (dto) => {
    const res = await actualizarPresupuesto(dto);
    return res.data;
};

export const obtenerPresupuestoSrv = async (id) => {
    const res = await obtenerPresupuesto(id);
    return res.data;
};
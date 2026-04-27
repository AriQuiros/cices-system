import {
    registrarGasto,
    actualizarGasto,
    eliminarGasto,
    obtenerGasto
} from "../api/gastoApi";

import { obtenerGastosPorPresupuesto } from "../api/gastoConsultaApi";
import {obtenerBitacoraGasto} from "../api/gastoBitacoraApi.js";

// crear gastos
export const registrarGastoSrv = async (listDto) => {
    const res = await registrarGasto(listDto);
    return res.data;
};

// update
export const actualizarGastoSrv = async (dto) => {
    const res = await actualizarGasto(dto);
    return res.data;
};

// delete
export const eliminarGastoSrv = async (id) => {
    const res = await eliminarGasto(id);
    return res.data;
};

// obtener uno
export const obtenerGastoSrv = async (id) => {
    const res = await obtenerGasto(id);
    return res.data;
};

// gastos por presupuesto
export const obtenerGastosPorPresupuestoSrv = async ({ id, pageable, ordenarPor, direccion }) => {
    const res = await obtenerGastosPorPresupuesto(id, pageable, ordenarPor, direccion);
    return {
        lista: res.data?.content || [],
        total: res.data?.totalElements || 0,
        totalPages: res.data?.totalPages || 0,
        page: res.data?.number || 0
    };
};

export const obtenerBitacoraGastoSrv = async (idGasto) => {
    const res = await obtenerBitacoraGasto(idGasto);
    return res.data || [];
};
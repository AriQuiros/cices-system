import {
    registrarGasto,
    actualizarGasto,
    eliminarGasto,
    obtenerGasto
} from "../../api/gastoApi/gastoApi.js";

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

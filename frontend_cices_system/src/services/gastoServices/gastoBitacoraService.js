import { obtenerBitacoraGasto } from "../../api/gastoApi/gastoBitacoraApi.js";

// bitácora (histórico)
export const obtenerBitacoraGastoSrv = async (idGasto) => {
    const res = await obtenerBitacoraGasto(idGasto);
    return res.data || [];
};
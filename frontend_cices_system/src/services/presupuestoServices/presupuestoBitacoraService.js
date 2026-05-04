import { obtenerBitacoraPresupuesto } from "../../api/presupuestoApi/presupuestoBitacoraApi.js";

export const obtenerBitacoraPresupuestoSrv = async (idPresupuesto) => {
    const res = await obtenerBitacoraPresupuesto(idPresupuesto);
    return res.data || [];
};
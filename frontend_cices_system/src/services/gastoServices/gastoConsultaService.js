import { obtenerGastosPorPresupuesto } from "../../api/gastoApi/gastoConsultaApi.js";

// listado paginado
export const obtenerGastosPorPresupuestoSrv = async ({ id, pageable, ordenarPor, direccion }) => {
    const res = await obtenerGastosPorPresupuesto(id, pageable, ordenarPor, direccion);

    return {
        lista: res.data?.content || [],
        total: res.data?.totalElements || 0,
        totalPages: res.data?.totalPages || 0,
        page: res.data?.number || 0
    };
};

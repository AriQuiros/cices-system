import { obtenerHorasPorPresupuesto } from "../../api/horasApi/horasConsultaApi.js";

// por presupuesto (listado paginado)
export const obtenerHorasPorPresupuestoSrv = async ({ id, pageable, ordenarPor, direccion }) => {
    const res = await obtenerHorasPorPresupuesto(id, pageable, ordenarPor, direccion);

    return {
        lista: res.data?.content || [],
        total: res.data?.totalElements || 0,
        totalPages: res.data?.totalPages || 0,
        page: res.data?.number || 0
    };
};
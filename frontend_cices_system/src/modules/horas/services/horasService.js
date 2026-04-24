import {
    registrarHoras,
    actualizarHora,
    eliminarHora,
    obtenerHora
} from "../api/horasApi";

import { obtenerHorasPorPresupuesto } from "../api/horasConsultaApi";

// registrar
export const registrarHorasSrv = async (listDto) => {
    const res = await registrarHoras(listDto);
    return res.data;
};

// actualizar
export const actualizarHoraSrv = async (dto) => {
    const res = await actualizarHora(dto);
    return res.data;
};

// eliminar
export const eliminarHoraSrv = async (id) => {
    const res = await eliminarHora(id);
    return res.data;
};

// obtener una
export const obtenerHoraSrv = async (id) => {
    const res = await obtenerHora(id);
    return res.data;
};

// por presupuesto
export const obtenerHorasPorPresupuestoSrv = async ({ id, pageable, ordenarPor, direccion }) => {
    const res = await obtenerHorasPorPresupuesto(id, pageable, ordenarPor, direccion);
    return {
        lista: res.data?.content || [],
        total: res.data?.totalElements || 0,
        totalPages: res.data?.totalPages || 0,
        page: res.data?.number || 0
    };
};
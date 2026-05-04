import {
    registrarHoras,
    actualizarHora,
    eliminarHora,
    obtenerHora
} from "../../api/horasApi/horasApi.js";

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

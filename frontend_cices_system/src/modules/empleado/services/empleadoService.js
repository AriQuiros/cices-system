import {
    crearEmpleado,
    obtenerPerfilEmpleado,
    actualizarEmpleado
} from "../api/empleadoApi";

export const registrarEmpleado = async (dto) => {
    const res = await crearEmpleado(dto);
    return res.data;
};

export const obtenerPerfilEmpleadoSrv = async () => {
    const res = await obtenerPerfilEmpleado();
    return res.data;
};

export const actualizarEmpleadoSrv = async (dto) => {
    const res = await actualizarEmpleado(dto);
    return res.data;
};
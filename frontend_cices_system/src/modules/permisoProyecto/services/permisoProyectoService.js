import {
    obtenerPermisosPorProyecto,
    otorgarPermisoProyecto,
    removerPermisoProyecto
} from "../api/permisoProyectoApi";

export const obtenerPermisosPorProyectoSrv = async (codigoProyecto) => {
    const res = await obtenerPermisosPorProyecto(codigoProyecto);
    return res.data;
};

export const otorgarPermisoSrv = async (permiso) => {
    const res = await otorgarPermisoProyecto(permiso);
    return res.data;
};

export const removerPermisoSrv = async (id) => {
    const res = await removerPermisoProyecto(id);
    return res.data;
};


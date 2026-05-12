import {
    listarNotificaciones,
    contarNoLeidas,
    marcarLeida,
    marcarNoLeida,
    eliminarNotificacion
} from "../../api/notificacionApi/notificacionApi.js";

export const listarNotificacionesSrv = async (filtro, pageable) => {
    const res = await listarNotificaciones(filtro, pageable);
    return res.data; // Page<RepNotificacionesUsuario>
};

export const contarNoLeidasSrv = async () => {
    const res = await contarNoLeidas();
    return res.data ?? 0;
};

export const marcarLeidaSrv    = async (id) => marcarLeida(id);
export const marcarNoLeidaSrv  = async (id) => marcarNoLeida(id);
export const eliminarSrv       = async (id) => eliminarNotificacion(id);
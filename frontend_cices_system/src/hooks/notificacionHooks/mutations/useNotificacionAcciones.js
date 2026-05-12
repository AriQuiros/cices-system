import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    marcarLeidaSrv,
    marcarNoLeidaSrv,
    eliminarSrv
} from "../../../services/notificacionServices/notificacionService.js";
import { NOTIFICACIONES_KEY } from "../queries/useNotificaciones.js";

const useAccion = (fn) => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: fn,
        onSuccess: () => qc.invalidateQueries({ queryKey: [NOTIFICACIONES_KEY] })
    });
};

export const useMarcarLeida   = () => useAccion((id) => marcarLeidaSrv(id));
export const useMarcarNoLeida = () => useAccion((id) => marcarNoLeidaSrv(id));
export const useEliminarNotif = () => useAccion((id) => eliminarSrv(id));
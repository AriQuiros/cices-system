import { useQuery } from "@tanstack/react-query";
import { listarNotificacionesSrv } from "../../../services/notificacionServices/notificacionService.js";

export const NOTIFICACIONES_KEY = "notificaciones";

export const useNotificacionesQuery = (filtro, pageable) => {
    return useQuery({
        queryKey: [NOTIFICACIONES_KEY, filtro, pageable],
        queryFn: () => listarNotificacionesSrv(filtro, pageable),
        keepPreviousData: true,
        staleTime: 0
    });
};
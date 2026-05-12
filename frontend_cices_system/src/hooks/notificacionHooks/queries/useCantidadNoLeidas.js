import { useQuery } from "@tanstack/react-query";
import { contarNoLeidasSrv } from "../../../services/notificacionServices/notificacionService.js";

export const useCantidadNoLeidasQuery = () => {

    return useQuery({
        queryKey: ["notificaciones", "cantidad-no-leidas"],
        queryFn: contarNoLeidasSrv,
        initialData: 0
    });
};
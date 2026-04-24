import { useQuery } from "@tanstack/react-query";
import { obtenerPresupuestoDetalle } from "../../services/presupuestoConsultaService.js";

export const usePresupuestoDetalle = (id) => {
    return useQuery({
        queryKey: ["presupuesto-detalle", id],
        queryFn: () => obtenerPresupuestoDetalle(id),
        enabled: !!id/*,
        /*refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false*/
    });
};
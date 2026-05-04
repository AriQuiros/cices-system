import { useQuery } from "@tanstack/react-query";
import { obtenerPresupuestoSrv } from "../../../services/presupuestoServices/presupuestoService.js";

export const usePresupuesto = (id) => {
    return useQuery({
        queryKey: ["presupuesto", id],
        queryFn: () => obtenerPresupuestoSrv(id),
        enabled: !!id,

        refetchOnWindowFocus: false,
        refetchOnMount: false,      // 👈 clave
        refetchOnReconnect: false
    });
};
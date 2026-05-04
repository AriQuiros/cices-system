import { useQuery } from "@tanstack/react-query";
import { obtenerBitacoraPresupuestoSrv } from "../../../services/presupuestoServices/presupuestoBitacoraService.js";

export const useBitacoraPresupuesto = (idPresupuesto) => {
    return useQuery({
        queryKey: ["bitacora-presupuesto", idPresupuesto],
        queryFn:  () => obtenerBitacoraPresupuestoSrv(idPresupuesto),
        enabled:  idPresupuesto != null,
        staleTime: 0
    });
};
// src/modules/gasto/hooks/queries/useBitacoraGasto.js
import { useQuery } from "@tanstack/react-query";
import { obtenerBitacoraGastoSrv } from "../../services/gastoService.js";

export const useBitacoraGasto = (idGasto) => {
    return useQuery({
        queryKey: ["bitacora-gasto", idGasto],
        queryFn: () => obtenerBitacoraGastoSrv(idGasto),
        enabled: idGasto != null,
        staleTime: 0
    });
};
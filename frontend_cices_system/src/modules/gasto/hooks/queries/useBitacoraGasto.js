import { useQuery } from "@tanstack/react-query";
import { obtenerBitacoraGasto } from "../../api/gastoBitacoraApi";

export const useBitacoraGasto = (idGasto) => {
    return useQuery({
        queryKey: ["bitacora-gasto", idGasto],
        queryFn: () => obtenerBitacoraGasto(idGasto)
    });
};
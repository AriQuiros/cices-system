import { useQuery } from "@tanstack/react-query";
import { obtenerGastoSrv } from "../../../services/gastoServices/gastoService.js";

export const useGasto = (id) => {
    return useQuery({
        queryKey: ["gasto", id],
        queryFn: () => obtenerGastoSrv(id),
        enabled: !!id,
    });
};
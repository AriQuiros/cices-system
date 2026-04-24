import { useQuery } from "@tanstack/react-query";
import { obtenerGastoSrv } from "../../services/gastoService";

export const useGasto = (id) => {
    return useQuery({
        queryKey: ["gasto", id],
        queryFn: () => obtenerGastoSrv(id),
        enabled: !!id,
    });
};
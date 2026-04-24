import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eliminarGastoSrv } from "../../services/gastoService";

export const useEliminarGasto = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: eliminarGastoSrv,

        onSuccess: () => {
            queryClient.invalidateQueries(["gastos-presupuesto"]);
        }
    });
};
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { actualizarGastoSrv } from "../../../services/gastoServices/gastoService.js";

export const useActualizarGasto = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: actualizarGastoSrv,

        onSuccess: () => {
            queryClient.invalidateQueries(["gastos-presupuesto"]);
        }
    });
};
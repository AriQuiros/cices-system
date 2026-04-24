import { useMutation, useQueryClient } from "@tanstack/react-query";
import { actualizarGastoSrv } from "../../services/gastoService";

export const useActualizarGasto = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: actualizarGastoSrv,

        onSuccess: () => {
            queryClient.invalidateQueries(["gastos-presupuesto"]);
        }
    });
};
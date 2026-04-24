import { useMutation, useQueryClient } from "@tanstack/react-query";
import { registrarGastoSrv } from "../../services/gastoService";

export const useRegistrarGasto = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: registrarGastoSrv,

        onSuccess: () => {
            queryClient.invalidateQueries(["gastos-presupuesto"]);
        }
    });
};
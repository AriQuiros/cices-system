import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eliminarHoraSrv } from "../../services/horasService";

export const useEliminarHora = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: eliminarHoraSrv,

        onSuccess: () => {
            queryClient.invalidateQueries(["horas-presupuesto"]);
        }
    });
};
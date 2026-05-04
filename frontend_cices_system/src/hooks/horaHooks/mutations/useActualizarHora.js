import { useMutation, useQueryClient } from "@tanstack/react-query";
import { actualizarHoraSrv } from "../../../services/horaServices/horasService.js";

export const useActualizarHora = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: actualizarHoraSrv,

        onSuccess: () => {
            queryClient.invalidateQueries(["horas-presupuesto"]);
        }
    });
};
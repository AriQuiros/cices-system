import { useMutation, useQueryClient } from "@tanstack/react-query";
import { registrarHorasSrv } from "../../../services/horaServices/horasService.js";

export const useRegistrarHoras = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: registrarHorasSrv,

        onSuccess: () => {
            queryClient.invalidateQueries(["horas-presupuesto"]);
        }
    });
};
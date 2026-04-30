import { useMutation, useQueryClient } from "@tanstack/react-query";
import { actualizarInvestigadorSrv } from "../../services/investigadorService";

export const useActualizarInvestigador = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: actualizarInvestigadorSrv,

        onSuccess: () => {
            queryClient.invalidateQueries(["investigador-perfil"]);
        }
    });
};
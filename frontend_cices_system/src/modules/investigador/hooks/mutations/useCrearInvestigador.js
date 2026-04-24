import { useMutation, useQueryClient } from "@tanstack/react-query";
import { registrarInvestigador } from "../services/investigadorService";

export const useCrearInvestigador = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: registrarInvestigador,

        onSuccess: () => {
            queryClient.invalidateQueries(["investigadores-busqueda"]);
        }
    });
};
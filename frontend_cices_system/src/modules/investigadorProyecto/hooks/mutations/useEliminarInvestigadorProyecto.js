import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eliminarInvestigadorProyectoSrv } from "../../services/investigadorProyectoService";

export const useEliminarInvestigadorProyecto = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: eliminarInvestigadorProyectoSrv,

        onSuccess: () => {
            queryClient.invalidateQueries(["ip-proyectos"]);
            queryClient.invalidateQueries(["ip-investigadores"]);
        }
    });
};
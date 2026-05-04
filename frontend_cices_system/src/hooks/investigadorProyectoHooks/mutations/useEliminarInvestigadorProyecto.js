import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eliminarInvestigadorProyectoSrv } from "../../../services/investigadorProyectoServices/investigadorProyectoService.js";

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
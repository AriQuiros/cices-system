import { useMutation, useQueryClient } from "@tanstack/react-query";
import { asignarInvestigadorProyectoSrv } from "../../services/investigadorProyectoService";

export const useAsignarInvestigadorProyecto = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: asignarInvestigadorProyectoSrv,

        onSuccess: () => {
            queryClient.invalidateQueries(["ip-proyectos"]);
            queryClient.invalidateQueries(["ip-investigadores"]);
        }
    });
};
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { actualizarInvestigadorProyectoSrv } from "../../services/investigadorProyectoService";

export const useActualizarInvestigadorProyecto = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: actualizarInvestigadorProyectoSrv,
        onSuccess: () => {
            queryClient.invalidateQueries(["ip-proyectos"]);
            queryClient.invalidateQueries(["ip-investigadores"]);
            queryClient.invalidateQueries(["ip-investigador"]);
        }
    });
};


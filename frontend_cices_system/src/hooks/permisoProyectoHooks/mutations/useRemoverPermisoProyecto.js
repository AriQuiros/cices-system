import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removerPermisoProyecto } from "../../../api/permisoProyectoApi/permisoProyectoApi.js";

export const useRemoverPermisoProyecto = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: removerPermisoProyecto,

        onSuccess: () => {
            queryClient.invalidateQueries(["permisos-proyecto"]);
        }
    });
};
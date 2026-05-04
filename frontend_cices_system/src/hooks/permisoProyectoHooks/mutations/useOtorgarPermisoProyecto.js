import { useMutation, useQueryClient } from "@tanstack/react-query";
import { otorgarPermisoProyecto } from "../../../api/permisoProyectoApi/permisoProyectoApi.js";

export const useOtorgarPermisoProyecto = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: otorgarPermisoProyecto,

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries([
                "permisos-proyecto",
                variables.codigoProyecto
            ]);
        }
    });
};
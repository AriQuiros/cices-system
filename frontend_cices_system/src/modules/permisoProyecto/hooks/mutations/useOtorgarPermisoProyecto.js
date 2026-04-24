import { useMutation, useQueryClient } from "@tanstack/react-query";
import { otorgarPermisoProyecto } from "../../api/permisoProyectoApi";

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
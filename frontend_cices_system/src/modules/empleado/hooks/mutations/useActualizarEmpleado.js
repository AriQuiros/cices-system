import { useMutation, useQueryClient } from "@tanstack/react-query";
import { actualizarEmpleadoSrv } from "../services/empleadoService";

export const useActualizarEmpleado = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: actualizarEmpleadoSrv,

        onSuccess: () => {
            queryClient.invalidateQueries(["empleado-perfil"]);
        }
    });
};
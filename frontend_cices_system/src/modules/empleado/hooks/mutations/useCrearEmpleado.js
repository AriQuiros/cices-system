import { useMutation, useQueryClient } from "@tanstack/react-query";
import { registrarEmpleado } from "../../services/empleadoService";

export const useCrearEmpleado = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: registrarEmpleado,

        onSuccess: () => {
            queryClient.invalidateQueries(["empleado-perfil"]);
        }
    });
};
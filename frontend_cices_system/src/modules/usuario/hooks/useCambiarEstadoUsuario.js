import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cambiarEstadoUsuario } from "../api/usuarioApi";

export const useCambiarEstadoUsuario = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, activo }) =>
            cambiarEstadoUsuario(id, activo),

        onSuccess: () => {
            queryClient.invalidateQueries(["usuarios"]);
        }
    });
};
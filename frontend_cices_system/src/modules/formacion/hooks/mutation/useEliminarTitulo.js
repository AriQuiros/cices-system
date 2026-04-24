import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eliminarTitulo } from "../../api/formacionApi";

export const useEliminarTitulo = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: eliminarTitulo,

        onSuccess: () => {
            queryClient.invalidateQueries(["certificaciones"]);
            queryClient.invalidateQueries(["mis-certificaciones"]);
        }
    });
};
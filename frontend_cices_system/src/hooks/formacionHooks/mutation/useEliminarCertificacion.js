import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eliminarCertificacion } from "../../../api/formacionApi/formacionApi.js";

export const useEliminarCertificacion = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: eliminarCertificacion,

        onSuccess: () => {
            queryClient.invalidateQueries(["certificaciones"]);
            queryClient.invalidateQueries(["mis-certificaciones"]);
        }
    });
};
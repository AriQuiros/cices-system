import { useMutation, useQueryClient } from "@tanstack/react-query";
import { guardarProyecto } from "../../services/proyectoService";

export const useGuardarProyecto = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ dto, documentos }) =>
            guardarProyecto(dto, documentos),

        onSuccess: () => {
            queryClient.invalidateQueries(["proyectos"]);
        }
    });
};
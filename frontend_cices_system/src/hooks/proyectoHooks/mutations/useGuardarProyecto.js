import { useMutation, useQueryClient } from "@tanstack/react-query";
import { guardarProyecto } from "../../../services/proyectoServices/proyectoService.js";

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
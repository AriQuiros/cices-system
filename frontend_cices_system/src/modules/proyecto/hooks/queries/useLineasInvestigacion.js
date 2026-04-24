import { useQuery } from "@tanstack/react-query";
import { obtenerLineas } from "../../services/proyectoService";

export const useLineasInvestigacion = () => {
    return useQuery({
        queryKey: ["lineas-investigacion"],
        queryFn: obtenerLineas,
        staleTime: 1000 * 60 * 60
    });
};
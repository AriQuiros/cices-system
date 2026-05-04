import { useQuery } from "@tanstack/react-query";
import { obtenerProyectos } from "../../../services/proyectoServices/proyectoConsultaService.js";

export const useProyectos = (filtro, pageable, options = {}) => {
    return useQuery({
        queryKey: ["proyectos", filtro, pageable],
        queryFn: () => obtenerProyectos(filtro, pageable),
        placeholderData: (prev) => prev,
        ...options
    });
};
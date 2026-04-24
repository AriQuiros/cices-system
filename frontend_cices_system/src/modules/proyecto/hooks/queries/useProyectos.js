import { useQuery } from "@tanstack/react-query";
import { obtenerProyectos } from "../../services/proyectoConsultaService";

export const useProyectos = (filtro, pageable) => {
    return useQuery({
        queryKey: ["proyectos", filtro, pageable],
        queryFn: () => obtenerProyectos(filtro, pageable),
        keepPreviousData: true
    });
};
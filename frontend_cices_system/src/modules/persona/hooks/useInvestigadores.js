import { useQuery } from "@tanstack/react-query";
import { obtenerInvestigadores } from "../api/personaApi";

export const useInvestigadoresConsulta = (filtro, pageable) => {
    return useQuery({
        queryKey: ["personas-investigadores", filtro, pageable],
        queryFn: () => obtenerInvestigadores(filtro, pageable),
        keepPreviousData: true
    });
};
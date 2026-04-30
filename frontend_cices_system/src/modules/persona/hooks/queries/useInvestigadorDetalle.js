// src/modules/persona/hooks/useInvestigadorDetalle.js
import { useQuery } from "@tanstack/react-query";
import { obtenerInvestigadorDetalle } from "../../api/personaApi.js";

export const useInvestigadorDetalle = (identificacion) => {
    return useQuery({
        queryKey: ["investigador-detalle", identificacion],
        queryFn: () => obtenerInvestigadorDetalle(identificacion),
        enabled: !!identificacion,
        staleTime: 1000 * 60 * 5
    });
};
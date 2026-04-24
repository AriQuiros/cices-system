import { useQuery } from "@tanstack/react-query";
import { obtenerResumenEjecutivo } from "../api/referenceApi";

export const useResumenEjecutivo = () => {
    return useQuery({
        queryKey: ["resumen-ejecutivo"],
        queryFn: () => obtenerResumenEjecutivo()
    });
};
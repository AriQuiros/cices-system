import { useQuery } from "@tanstack/react-query";
import { obtenerResumenEjecutivo } from "../../api/referenceDataApi/referenceApi.js";

export const useResumenEjecutivo = () => {
    return useQuery({
        queryKey: ["resumen-ejecutivo"],
        queryFn: () => obtenerResumenEjecutivo()
    });
};
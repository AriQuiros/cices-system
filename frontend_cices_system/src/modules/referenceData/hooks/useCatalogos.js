import { useQuery } from "@tanstack/react-query";
import {
    obtenerCatalogosPorTipos
} from "../api/referenceApi";

export const useCatalogos = (tipos) => {
    return useQuery({
        queryKey: ["catalogos", tipos],
        queryFn: () => obtenerCatalogosPorTipos(tipos),
        enabled: Array.isArray(tipos) && tipos.length > 0
    });
};

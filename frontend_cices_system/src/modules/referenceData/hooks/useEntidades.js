import { useQuery } from "@tanstack/react-query";
import { buscarEntidades } from "../api/referenceApi";

export const useEntidades = (nombre, tipo) => {
    return useQuery({
        queryKey: ["entidades", nombre, tipo],
        queryFn: () => buscarEntidades(nombre, tipo),
        keepPreviousData: true,
        enabled: !!nombre
    });
};
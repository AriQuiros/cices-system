import { useQuery } from "@tanstack/react-query";
import { obtenerRolesProyecto } from "../api/referenceApi";

export const useRolesProyecto = () => {
    return useQuery({
        queryKey: ["roles-proyecto"],
        queryFn: () => obtenerRolesProyecto()
    });
};
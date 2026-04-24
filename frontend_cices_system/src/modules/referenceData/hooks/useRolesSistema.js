import { useQuery } from "@tanstack/react-query";
import { obtenerRolesSistema } from "../api/referenceApi";

export const useRolesSistema = () => {
    return useQuery({
        queryKey: ["roles-sistema"],
        queryFn: () => obtenerRolesSistema()
    });
};
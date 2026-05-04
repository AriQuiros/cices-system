import { useQuery } from "@tanstack/react-query";
import { obtenerRolesSistema } from "../../api/referenceDataApi/referenceApi.js";

export const useRolesSistema = (options = {}) => {
    return useQuery({
        queryKey: ["roles-sistema"],
        queryFn: () => obtenerRolesSistema(),
    });
};
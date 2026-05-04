import { useQuery } from "@tanstack/react-query";
import { obtenerRolesProyecto } from "../../api/referenceDataApi/referenceApi.js";

export const useRolesProyecto = () => {
    return useQuery({
        queryKey: ["roles-proyecto"],
        queryFn: async () => {
            const res = await obtenerRolesProyecto();
            return res.data;
        },
        staleTime: 1000 * 60 * 10
    });
};
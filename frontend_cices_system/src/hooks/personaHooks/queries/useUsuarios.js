import { useQuery } from "@tanstack/react-query";
import { obtenerUsuarios } from "../../../api/personaApi/personaApi.js";

export const useUsuarios = (filtro, pageable) => {
    return useQuery({
        queryKey: ["personas-usuarios", filtro, pageable],
        queryFn: () => obtenerUsuarios(filtro, pageable),
        keepPreviousData: true
    });
};
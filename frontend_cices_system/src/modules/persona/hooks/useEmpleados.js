import { useQuery } from "@tanstack/react-query";
import { obtenerEmpleados } from "../api/personaApi";

export const useEmpleados = (filtro, pageable) => {
    return useQuery({
        queryKey: ["personas-empleados", filtro, pageable],
        queryFn: () => obtenerEmpleados(filtro, pageable),
        keepPreviousData: true
    });
};
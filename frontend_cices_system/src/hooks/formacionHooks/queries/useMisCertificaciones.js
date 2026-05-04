import { useQuery } from "@tanstack/react-query";
import { misCertificaciones } from "../../../api/formacionApi/formacionApi.js";

export const useMisCertificaciones = (filtro, pageable) => {
    return useQuery({
        queryKey: ["mis-certificaciones", filtro, pageable],
        queryFn: () => misCertificaciones(filtro, pageable),
        keepPreviousData: true
    });
};
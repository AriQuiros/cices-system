import { useQuery } from "@tanstack/react-query";
import { filtrarCertificaciones } from "../../api/formacionApi.js";

export const useCertificaciones = (filtro, pageable) => {
    return useQuery({
        queryKey: ["certificaciones", filtro, pageable],
        queryFn: () => filtrarCertificaciones(filtro, pageable),
        keepPreviousData: true
    });
};
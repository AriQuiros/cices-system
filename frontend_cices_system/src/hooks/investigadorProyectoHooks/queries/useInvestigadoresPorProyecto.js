import { useQuery } from "@tanstack/react-query";
import { obtenerInvestigadoresPorProyectoSrv } from "../../../services/investigadorProyectoServices/investigadorProyectoConsultaService.js";

export const useInvestigadoresPorProyecto = (codigo, pageable, ordenPor, direccion) => {
    return useQuery({
        queryKey: ["ip-investigadores", codigo, pageable, ordenPor, direccion],
        queryFn: () => obtenerInvestigadoresPorProyectoSrv(codigo, pageable, ordenPor, direccion),
        keepPreviousData: true,
        enabled: !!codigo
    });
};
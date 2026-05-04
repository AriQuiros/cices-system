import { useQuery } from "@tanstack/react-query";
import { obtenerInvestigadorProyectoSrv } from "../../../services/investigadorProyectoServices/investigadorProyectoService.js";

export const useInvestigadorPorId = (id) => {
    return useQuery({
        queryKey: ["ip-investigador", id],
        queryFn: () => obtenerInvestigadorProyectoSrv(id),
        enabled: !!id
    });
};


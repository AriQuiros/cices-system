// src/modules/investigadorProyecto/hooks/queries/useListarInvestigadorProyecto.js
import { useQuery } from "@tanstack/react-query";
import { listarInvestigadorProyectoSrv } from "../../../services/investigadorProyectoServices/investigadorProyectoConsultaService.js";

export const useListarInvestigadorProyecto = (filtro, filtroInv, pageable, enable) => {
    return useQuery({
        queryKey: ["ip-listar", filtro, filtroInv, pageable],
        queryFn: () => listarInvestigadorProyectoSrv(filtro, filtroInv, pageable),
        keepPreviousData: true,
        enabled: enable
    });
};
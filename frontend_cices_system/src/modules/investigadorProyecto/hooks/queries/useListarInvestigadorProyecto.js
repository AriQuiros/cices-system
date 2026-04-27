// src/modules/investigadorProyecto/hooks/queries/useListarInvestigadorProyecto.js
import { useQuery } from "@tanstack/react-query";
import { listarInvestigadorProyectoSrv } from "../../services/investigadorProyectoService.js";

export const useListarInvestigadorProyecto = (filtro, filtroInv, pageable) => {
    return useQuery({
        queryKey: ["ip-listar", filtro, filtroInv, pageable],
        queryFn: () => listarInvestigadorProyectoSrv(filtro, filtroInv, pageable),
        keepPreviousData: true,
        enabled: true
    });
};
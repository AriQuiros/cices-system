import { useQuery } from "@tanstack/react-query";
import { buscarInvestigadoresSrv } from "../../../services/investigadorServices/investigadorService.js";

export const useBuscarInvestigadores = (nombre) => {
    return useQuery({
        queryKey: ["investigadores-busqueda", nombre],
        queryFn: () => buscarInvestigadoresSrv(nombre),
        enabled: !!nombre
    });
};
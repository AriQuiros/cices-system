import { useQuery } from "@tanstack/react-query";
import { obtenerPerfilInvestigadorSrv } from "../../../services/investigadorServices/investigadorService.js";

export const usePerfilInvestigador = (enabled = true) => {
    return useQuery({
        queryKey: ["investigador-perfil"],
        queryFn: obtenerPerfilInvestigadorSrv,
        enabled: enabled

    });
};
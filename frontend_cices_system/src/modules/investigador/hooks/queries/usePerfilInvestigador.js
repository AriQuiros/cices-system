import { useQuery } from "@tanstack/react-query";
import { obtenerPerfilInvestigadorSrv } from "../../services/investigadorService.js";

export const usePerfilInvestigador = () => {
    return useQuery({
        queryKey: ["investigador-perfil"],
        queryFn: obtenerPerfilInvestigadorSrv
    });
};
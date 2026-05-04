import { useQuery } from "@tanstack/react-query";
import { obtenerProyectosInvestigadorSrv } from "../../../services/investigadorProyectoServices/investigadorProyectoConsultaService.js";

export const useProyectosInvestigador = (texto, soloPrincipalOPermiso, pageable, options = {}) => {
    return useQuery({
        queryKey: ["ip-proyectos", texto, soloPrincipalOPermiso, pageable],
        queryFn: () => obtenerProyectosInvestigadorSrv(texto, soloPrincipalOPermiso, pageable),
        placeholderData: (prev) => prev,
        ...options
    });
};
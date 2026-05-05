import { useQuery } from "@tanstack/react-query";
import {listarParticipantesSrv} from "../../../services/exportServices/exportListadoService.js";

export const useParticipantesQuery = (filtroProyecto, pageable, limite) => {

    return useQuery({
        queryKey: ["participantes", filtroProyecto, pageable, limite],
        queryFn: () => listarParticipantesSrv(filtroProyecto, pageable, limite),
        keepPreviousData: true
    });
};
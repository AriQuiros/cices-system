import { useQuery } from "@tanstack/react-query";
import { obtenerProyectoDetalleReporte } from "../../services/proyectoConsultaService";

export const useProyectoDetalle = (idProyecto) => {
    return useQuery({
        queryKey: ["proyecto-detalle", idProyecto],
        queryFn: () => obtenerProyectoDetalleReporte(idProyecto),
        enabled: !!idProyecto
    });
};
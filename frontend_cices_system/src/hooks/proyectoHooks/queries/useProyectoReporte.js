// modules/proyecto/hooks/queries/useProyectoReporte.js
import { useQuery } from "@tanstack/react-query";
import { obtenerProyectoReportePorCodigo } from "../../../services/proyectoServices/proyectoConsultaService.js";

export const useProyectoReporte = (codigoProyecto) => {
    return useQuery({
        queryKey: ["proyecto-reporte", codigoProyecto],
        queryFn:  () => obtenerProyectoReportePorCodigo(codigoProyecto),
        enabled:  !!codigoProyecto,
        staleTime: 1000 * 60 * 5   // 5 min — vista de solo lectura, no necesita refetch constante
    });
};
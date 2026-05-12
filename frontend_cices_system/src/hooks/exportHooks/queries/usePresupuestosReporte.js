import { useQuery } from "@tanstack/react-query";
import { listarPresupuestosReporteSrv } from "../../../services/exportServices/exportListadoService.js";

export const usePresupuestosReporteQuery = (filtroProyecto, filtroPresupuesto, pageable, limite) => {
    return useQuery({
        queryKey: ["reporte-presupuestos", filtroProyecto, filtroPresupuesto, pageable, limite],
        queryFn: () => listarPresupuestosReporteSrv(filtroProyecto, filtroPresupuesto, pageable, limite),
        keepPreviousData: true
    });
};
import { useQuery } from "@tanstack/react-query";
import { listarPresupuestosReporteSrv } from "../../../services/exportServices/exportListadoService.js";

export const usePresupuestosReporteQuery = (filtro, pageable, limite) => {
    return useQuery({
        queryKey: ["reporte-presupuestos", filtro, pageable, limite],
        queryFn: () => listarPresupuestosReporteSrv(filtro, pageable, limite),
        keepPreviousData: true
    });
};
import { useQuery } from "@tanstack/react-query";
import { buscarPresupuestosSrv } from "../../../services/presupuestoServices/presupuestoConsultaService.js";

export const useBusquedaPresupuestos = (filtro, pageable) => {
    return useQuery({
        queryKey: [
            "presupuestos-busqueda",
            filtro.codigoProyecto,
            filtro.tipoPresupuesto,
            filtro.busqueda,
            pageable.page,
            pageable.size
        ],
        queryFn: () => buscarPresupuestosSrv(filtro, pageable),
        keepPreviousData: true,
        enabled: !!filtro?.codigoProyecto
    });
};
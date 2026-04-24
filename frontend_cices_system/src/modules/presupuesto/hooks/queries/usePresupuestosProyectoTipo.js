import { useQuery } from "@tanstack/react-query";
import { obtenerPresupuestosProyectoTipo } from "../../services/presupuestoConsultaService.js";

export const usePresupuestosProyectoTipo = (
    filtro,
    ordenamiento,
    pageable
) => {
    return useQuery({
        queryKey: [
            "presupuestos-proyecto-tipo",
            filtro,
            ordenamiento,
            pageable
        ],
        queryFn: () =>
            obtenerPresupuestosProyectoTipo(filtro, ordenamiento, pageable),
        keepPreviousData: true,
        enabled: !!filtro?.codigoProyecto
    });
};
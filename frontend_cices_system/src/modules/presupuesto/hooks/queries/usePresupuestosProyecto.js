import { useQuery } from "@tanstack/react-query";
import { obtenerPresupuestosProyecto } from "../../services/presupuestoConsultaService.js";

export const usePresupuestosProyecto = (filtro, ordenamiento, pageable) => {
    return useQuery({
        queryKey: ["presupuestos-proyecto", filtro, ordenamiento, pageable],
        queryFn: () =>
            obtenerPresupuestosProyecto(filtro, ordenamiento, pageable),
        keepPreviousData: true,
        enabled: !!filtro?.codigoProyecto

    });
};
import { useQuery } from "@tanstack/react-query";
import { obtenerHorasPorPresupuestoSrv } from "../../services/horasService";

export const useHorasPorPresupuesto = (id, pageable, ordenarPor, direccion) => {
    return useQuery({
        queryKey: ["horas-presupuesto", id, pageable.page, pageable.size, ordenarPor, direccion],
        queryFn: () => obtenerHorasPorPresupuestoSrv({ id, pageable, ordenarPor, direccion }),
        keepPreviousData: true,
        enabled: id != null
    });
};
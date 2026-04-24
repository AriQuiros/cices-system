import { useQuery } from "@tanstack/react-query";
import {obtenerGastosPorPresupuestoSrv} from "../../services/gastoService.js";

export const useGastosPorPresupuesto = (id, pageable, ordenarPor, direccion) => {
    return useQuery({
        queryKey: [
            "gastos-presupuesto",
            id,
            pageable.page,
            pageable.size,
            ordenarPor,
            direccion
        ],
        queryFn: () =>
            obtenerGastosPorPresupuestoSrv({
                id,
                pageable,
                ordenarPor,
                direccion
            }),
        keepPreviousData: true,
        enabled: id != null
    });
};
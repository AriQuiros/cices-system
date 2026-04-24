import { useMutation, useQueryClient } from "@tanstack/react-query";
import { actualizarPresupuestoSrv } from "../../services/presupuestoService.js";

export const useActualizarPresupuesto = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: actualizarPresupuestoSrv,

        onSuccess: () => {
            queryClient.invalidateQueries(["presupuesto"]);
            queryClient.invalidateQueries(["presupuestos-proyecto"]);
        }
    });
};
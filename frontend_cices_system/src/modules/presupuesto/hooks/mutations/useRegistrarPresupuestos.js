import { useMutation, useQueryClient } from "@tanstack/react-query";
import { guardarPresupuestos } from "../../services/presupuestoService.js";

export const useRegistrarPresupuesto = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ codigoProyecto, lista }) =>
            guardarPresupuestos(codigoProyecto, lista),

        onSuccess: () => {
            queryClient.invalidateQueries(["presupuestos-proyecto"]);
        }
    });
};
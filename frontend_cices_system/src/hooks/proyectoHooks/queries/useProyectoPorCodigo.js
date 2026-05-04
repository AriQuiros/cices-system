import { useQuery } from "@tanstack/react-query";
import { obtenerProyectoEdicion } from "../../../services/proyectoServices/proyectoService.js";

export const useProyectoPorCodigo = (codigoProyecto) => {
    return useQuery({
        queryKey: ["proyecto-edicion", codigoProyecto],
        queryFn: () => obtenerProyectoEdicion(codigoProyecto),
        enabled: !!codigoProyecto,
        staleTime: 0  // siempre fresco al abrir edición
    });
};
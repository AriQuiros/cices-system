import { useQuery } from "@tanstack/react-query";
import { obtenerPermisosPorProyecto } from "../../api/permisoProyectoApi";

export const usePermisosProyecto = (codigoProyecto) => {
    return useQuery({
        queryKey: ["permisos-proyecto", codigoProyecto],
        queryFn: () => obtenerPermisosPorProyecto(codigoProyecto),
        enabled: !!codigoProyecto
    });
};
import { useQuery } from "@tanstack/react-query";
import { obtenerPerfilEmpleadoSrv } from "../../../services/empleadoServices/empleadoService.js";

export const usePerfilEmpleado = ( enabled = true) => {
    return useQuery({
        queryKey: ["perfil-empleado"],
        queryFn: obtenerPerfilEmpleadoSrv,
        enabled: enabled
    });
};
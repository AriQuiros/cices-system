import { useQuery } from "@tanstack/react-query";
import { obtenerPerfilEmpleadoSrv } from "../../../services/empleadoServices/empleadoService.js";

export const usePerfilEmpleado = () => {
    return useQuery({
        queryKey: ["perfil-empleado"],
        queryFn: obtenerPerfilEmpleadoSrv
    });
};
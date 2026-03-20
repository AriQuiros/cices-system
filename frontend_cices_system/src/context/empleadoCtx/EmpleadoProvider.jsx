import { EmpleadoContext } from "./EmpleadoContext.jsx";
import { EmpleadoDTO, UsuarioDTO } from "../../modelos/empleadoDTO.jsx";
import { useDTO } from "../utils/useDTO.js";

export const EmpleadoProvider = ({ children }) => {

    const empleadoState = useDTO(EmpleadoDTO);
    const usuarioState = useDTO(UsuarioDTO);

    return (
        <EmpleadoContext.Provider
            value={{
                empleado: empleadoState.data,
                actualizarCampo: empleadoState.actualizarCampo,
                limpiarEmpleado: empleadoState.limpiar,
                setEmpleado: empleadoState.establecer,

                usuario: usuarioState.data,
                actualizarCampoUsuario: usuarioState.actualizarCampo,
                limpiarUsuario: usuarioState.limpiar,
                setUsuario: usuarioState.establecer
            }}
        >
            {children}
        </EmpleadoContext.Provider>
    );
};
import { useState } from "react";
import { EmpleadoContext } from "./EmpleadoContext.jsx";
import { EmpleadoDTO, UsuarioDTO } from "../../modelos/empleadoDTO.jsx";

export const EmpleadoProvider = ({ children }) => {
    const [empleado, setEmpleado] = useState({ ...EmpleadoDTO });

    const actualizarCampo = (campo, valor) => {
        setEmpleado(prev => ({
            ...prev,
            [campo]: valor
        }));
    };

    const limpiarEmpleado = () => {
        setEmpleado({ ...EmpleadoDTO });
    };

    const [usuario, setUsuario] = useState({ ...UsuarioDTO });

    const actualizarCampoUsuario = (campo, valor) => {
        setUsuario(prev => ({
            ...prev,
            [campo]: valor
        }));
    };

    const limpiarUsuario = () => {
        setUsuario({ ...UsuarioDTO });
    };

    return (
        <EmpleadoContext.Provider
            value={{
                empleado,
                actualizarCampo,
                limpiarEmpleado,
                usuario,
                actualizarCampoUsuario,
                limpiarUsuario
            }}
        >
            {children}
        </EmpleadoContext.Provider>
    );
};
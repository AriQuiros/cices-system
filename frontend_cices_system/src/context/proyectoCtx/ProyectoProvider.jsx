import { useDTO } from "../utils/useDTO.js";
import { setByPath, addByPath, removeByPath } from "../utils/pathHelpers.js";

import { ProyectoContext } from "./ProyectoContext.jsx";
import { ProyectoDTO } from "../../modelos/proyectoDTO.jsx";
import { PresupuestoDTO } from "../../modelos/presupuestoDTO.jsx";

export const ProyectoProvider = ({ children }) => {

    const proyectoState = useDTO(ProyectoDTO);
    const presupuestoState = useDTO(PresupuestoDTO);

    const setProyectoByPath = (path, value) => {
        setByPath(proyectoState.setData, path, value);
    };

    const addProyectoByPath = (path, value) => {
        addByPath(proyectoState.setData, path, value);
    };

    const removeProyectoByPath = (path, index) => {
        removeByPath(proyectoState.setData, path, index);
    };

    return (
        <ProyectoContext.Provider
            value={{
                proyecto: proyectoState.data,
                actualizarCampo: proyectoState.actualizarCampo,
                limpiarProyecto: proyectoState.limpiar,
                establecerProyecto: proyectoState.establecer,

                presupuesto: presupuestoState.data,
                setPresupuestos: presupuestoState.setData,
                limpiarPresupuestoActual: presupuestoState.limpiar,

                setByPath: setProyectoByPath,
                addByPath: addProyectoByPath,
                removeByPath: removeProyectoByPath
            }}
        >
            {children}
        </ProyectoContext.Provider>
    );
};
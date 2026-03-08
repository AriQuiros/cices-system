import { useContext } from "react";
import { EmpleadoContext } from "./EmpleadoContext.jsx";

export const useEmpleado = () => {
    const context = useContext(EmpleadoContext);
    if (!context) {
        throw new Error("useEmpleado debe usarse dentro de EmpleadoProvider");
    }
    return context;
};
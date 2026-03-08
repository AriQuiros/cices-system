import { useContext } from "react";
import { ProyectoContext } from "./ProyectoContext";

export const useProyecto = () => {
    const context = useContext(ProyectoContext);
    if (!context) {
        throw new Error("useProyecto debe usarse dentro de ProyectoProvider");
    }
    return context;
};
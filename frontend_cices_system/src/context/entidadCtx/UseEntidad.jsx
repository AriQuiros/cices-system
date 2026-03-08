import { useContext } from "react";
import { EntidadContext } from "./EntidadContext";

export const useEntidad = () => {
    const context = useContext(EntidadContext);
    if (!context) throw new Error("useEntidad debe usarse dentro de EntidadProvider");
    return context;
};
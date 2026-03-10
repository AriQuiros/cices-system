import { useContext } from "react";
import { PresupuestoContext } from "./PresupuestoContext.jsx";

export const usePresupuesto = () => {
    const context = useContext(PresupuestoContext);
    if (!context) {
        throw new Error("usePresupuesto debe usarse dentro de PresupuestoProvider");
    }
    return context;
};
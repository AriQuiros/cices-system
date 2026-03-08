import { useState } from "react";
import { EntidadContext } from "./EntidadContext.jsx";

export const EntidadProvider = ({ children }) => {
    const [entidades, setEntidades] = useState([]);

    const agregarEntidad = (nuevaEntidad) => {
        setEntidades(prev => [...prev, nuevaEntidad]);
    };

    return (
        <EntidadContext.Provider value={{ entidades, agregarEntidad }}>
            {children}
        </EntidadContext.Provider>
    );
};
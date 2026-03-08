import { useContext } from "react";
import { InvestigadorContext } from "./InvestigadorContext";

export const useInvestigador = () => {
    const context = useContext(InvestigadorContext);
    if (!context) {
        throw new Error("useInvestigador debe usarse dentro de InvestigadorProvider");
    }
    return context;
};
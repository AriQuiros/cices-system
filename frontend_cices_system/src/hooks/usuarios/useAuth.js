import { useContext, useMemo } from "react";
import { AppContext } from "../../context/AppContext";

export function useAuth() {

    const { token, user, login } = useContext(AppContext);

    const roles = useMemo(() => user?.roles ?? [], [user?.roles]);

    const isInvestigador = useMemo(() => {
        return roles.some(
            (r) =>
                r === "INVESTIGADOR" ||
                r?.nombreRol?.toUpperCase() === "INVESTIGADOR"
        );
    }, [roles]);

    const hasRole = (rol) =>
        roles.some(
            (r) =>
                r === rol ||
                r?.nombreRol?.toUpperCase() === rol.toUpperCase()
        );

    return {
        login,
        token,
        user,
        roles,
        isInvestigador,
        hasRole
    };
}
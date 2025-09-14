import { useContext } from "react";
import { AppContext } from "./AppContext.jsx";

export function useAuth() {
    return useContext(AppContext);
}

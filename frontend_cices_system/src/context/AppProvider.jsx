import { useState } from "react";
import { AppContext } from "./AppContext.jsx";

export default function AppProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || null);

    const login = (userData, token) => {
        setUser(userData);
        setToken(token);
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.clear();
    };

    return (
        <AppContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AppContext.Provider>
    );
}

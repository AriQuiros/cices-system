/*import {useEffect, useState} from "react";

const parseJwt = (t) => {
    try {
        return JSON.parse(atob(t.split(".")[1]));
    } catch {
        return null;
    }
};

const loadAuth = () => {
    try {
        const raw = sessionStorage.getItem("auth") || localStorage.getItem("auth");
        if (!raw) return { user: null, token: null, exp: 0 };
        const obj = JSON.parse(raw);
        const expMs = (obj?.exp ?? 0) * 1000;
        if (expMs && expMs < Date.now()) {
            sessionStorage.removeItem("auth");
            localStorage.removeItem("auth");
            return { user: null, token: null, exp: 0 };
        }
        return { user: obj.user ?? null, token: obj.token ?? null, exp: obj.exp ?? 0 };
    } catch {
        return { user: null, token: null, exp: 0 };
    }
};


export const authProvider = ({ children }) => {
    const init = loadAuth();
    const [user, setUser] = useState(init.user);
    const [token, setToken] = useState(init.token);

    useEffect(() => {
        let id;
        if (token) {
            const p = parseJwt(token);
            const expMs = (p?.exp ?? 0) * 1000;
            const delay = expMs - Date.now();
            if (delay > 0) id = setTimeout(() => logout(), delay);
            else logout();
        }
        return () => id && clearTimeout(id);
    }, [token]);

    const login = (userData, jwt, remember = false) => {
        setUser(userData);
        setToken(jwt);
        const exp = parseJwt(jwt)?.exp ?? 0;
        const store = remember ? localStorage : sessionStorage;
        store.setItem("auth", JSON.stringify({ user: userData, token: jwt, exp }));
        (remember ? sessionStorage : localStorage).removeItem("auth");
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        sessionStorage.removeItem("auth");
        localStorage.removeItem("auth");
    };
}*/
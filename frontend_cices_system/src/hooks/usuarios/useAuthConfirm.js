import { useState } from "react";
import { loginRequest } from "../../services/AuthService.jsx";
import { notify } from "../../utils/ui/notify.jsx";

export const useAuthConfirm = (user) => {

    const [requiereAuth, setRequiereAuth] = useState(false);
    const [authPassword, setAuthPassword] = useState("");
    const [authOk, setAuthOk] = useState(false);

    const handleReAuth = async () => {
        try {
            const res = await loginRequest(user.username, authPassword);

            if (!res.ok) {
                notify.error("Contraseña incorrecta");
                return;
            }

            setAuthOk(true);
            setRequiereAuth(false);

            notify.success("Identidad confirmada");

        } catch {
            notify.error("Error de conexión");
        }
    };

    return {
        requiereAuth,
        authPassword,
        authOk,
        setRequiereAuth,
        setAuthPassword,
        handleReAuth
    };
};
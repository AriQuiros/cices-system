import { useState, useRef, useEffect } from "react";
import { useNavigate, useNavigationType } from "react-router-dom";
import { useLogin } from "./mutations/useLogin.js";
import { useAuth } from "../../../context/useAuth.js";

/**
 * Orquestador del formulario de Login.
 *
 * Responsabilidades:
 *  - Estado del formulario (username / password)
 *  - Mensajes de error según código HTTP (401 / 423 / otros)
 *  - Cuenta regresiva cuando la cuenta queda bloqueada (423)
 *  - Cierre de sesión al navegar hacia atrás (POP)
 *  - Redirección post-login según rol del usuario
 *
 * El componente Login.jsx solo consume este hook y renderiza la UI.
 */
export const useLoginForm = () => {
    const { logout } = useAuth();
    const { mutate: loginMutate, isPending } = useLogin();

    const [form, setForm] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const [secondsLeft, setSecondsLeft] = useState(0);

    const timerRef = useRef(null);
    const navigate = useNavigate();
    const navType = useNavigationType();

    // Cerrar sesión si el usuario regresa con el botón "atrás"
    useEffect(() => {
        if (navType === "POP") {
            logout();
            navigate("/", { replace: true });
        }
    }, [navType, logout, navigate]);

    // Limpiar el intervalo al desmontar el componente
    useEffect(() => () => clearTimer(), []);

    // ─── Timer helpers ────────────────────────────────────────────────────────

    const clearTimer = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    };

    const formatMMSS = (totalSeconds) => {
        const m = Math.floor(totalSeconds / 60);
        const s = String(totalSeconds % 60).padStart(2, "0");
        return `${m}:${s}`;
    };

    const startCountdown = (mins) => {
        clearTimer();
        const total = Math.max(0, Math.floor(mins * 60));
        setSecondsLeft(total);
        if (total === 0) return;

        timerRef.current = setInterval(() => {
            setSecondsLeft((prev) => {
                if (prev <= 1) { clearTimer(); return 0; }
                return prev - 1;
            });
        }, 1000);
    };

    // ─── Handlers ────────────────────────────────────────────────────────────

    const handleChange = (e) => {
        setError("");
        setSecondsLeft(0);
        clearTimer();
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        setSecondsLeft(0);
        clearTimer();

        loginMutate(
            { username: form.username, password: form.password },
            {
                onSuccess: (data) => {
                    const roles = data.user?.roles || [];
                    const destino = roles.includes("DIRECCION")
                        ? "/dashboard"
                        : "/listado-proyectos";

                    const bienvenida = `Bienvenid@, ${
                        data.user?.nombreCompleto || data.user?.username || ""
                    }`;

                    navigate(destino, { state: { toast: bienvenida } });
                },

                onError: (err) => {
                    const status = err?.response?.status;
                    const headers = err?.response?.headers;
                    const body = err?.response?.data;

                    if (status === 401) {
                        const remaining = headers?.["x-login-attempts-remaining"];
                        setError(
                            `Credenciales inválidas${
                                remaining ? ` · Intentos restantes: ${remaining}` : ""
                            }`
                        );
                    } else if (status === 423) {
                        const mins = Number(body?.remainingMinutes ?? 0);
                        if (mins > 0) {
                            startCountdown(mins);
                            // El mensaje dinámico lo construye errorDisplay más abajo
                        } else {
                            setError("Cuenta bloqueada temporalmente.");
                        }
                    } else {
                        setError(
                            body?.error || "No se pudo conectar con el servidor"
                        );
                    }
                },
            }
        );
    };

    // ─── Valores derivados expuestos al componente ────────────────────────────

    // Si el contador está activo, tiene prioridad sobre el mensaje de texto
    const errorDisplay =
        secondsLeft > 0
            ? `Cuenta bloqueada. Intenta en ${formatMMSS(secondsLeft)}`
            : error;

    return {
        form,
        handleChange,
        handleSubmit,
        isPending,
        errorDisplay,
        hasError: !!(error || secondsLeft > 0),
    };
};

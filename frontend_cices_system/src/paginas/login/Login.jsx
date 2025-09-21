import { useAuth } from "../../context/useAuth.js";
import "./Login.css";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:8080";

function Login() {
    const { login } = useAuth();
    const [form, setForm] = useState({ username: "", password: "" });
    const [localError, setLocalError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(0);
    const timerRef = useRef(null);
    const navigate = useNavigate();

    const clearTimer = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    };

    useEffect(() => () => clearTimer(), []);

    const formatMMSS = (s) => {
        const m = Math.floor(s / 60);
        const ss = String(s % 60).padStart(2, "0");
        return `${m}:${ss}`;
    };

    const startCountdown = (mins) => {
        clearTimer();
        const total = Math.max(0, Math.floor(mins * 60));
        setSecondsLeft(total);
        if (total === 0) return;
        timerRef.current = setInterval(() => {
            setSecondsLeft((prev) => {
                if (prev <= 1) {
                    clearTimer();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleChange = (e) => {
        setLocalError("");
        setSecondsLeft(0);
        clearTimer();
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (submitting) return;
        setSubmitting(true);
        setLocalError("");
        setSecondsLeft(0);
        clearTimer();
        try {
            const payload = { username: form.username.trim(), password: form.password };
            const res = await fetch(`${API}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                let msg = "Error en servidor";
                if (res.status === 401) {
                    const remaining = res.headers.get("X-Login-Attempts-Remaining");
                    msg = `Credenciales inválidas${remaining ? ` · Intentos restantes: ${remaining}` : ""}`;
                } else if (res.status === 423) {
                    let mins = 0;
                    try {
                        const j = await res.json();
                        mins = Number(j?.remainingMinutes ?? 0);
                    } catch {}
                    if (mins > 0) {
                        startCountdown(mins);
                        msg = `Cuenta bloqueada. Intenta en ${formatMMSS(mins * 60)}`;
                    } else {
                        msg = "Cuenta bloqueada temporalmente.";
                    }
                } else {
                    try {
                        const j = await res.json();
                        if (j?.error) msg = j.error;
                    } catch {}
                }
                setLocalError(msg);
                return;
            }

            const data = await res.json(); // { token, user }
            login(data.user, data.token);

            const r = data.user.roles || [];
            if (r.includes("DIRECTOR")) navigate("/director");
            else if (r.includes("ADMINISTRADOR")) navigate("/administrador");
            else if (r.includes("INVESTIGADOR")) navigate("/investigador");
            else navigate("/dashboard");
        } catch {
            setLocalError("No se pudo conectar con el servidor");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section className="login-container">
            <div className="login-card">
                <h2>Bienvenidos</h2>
                <h3>Iniciar Sesión</h3>

                <form onSubmit={handleSubmit} className="login-form">
                    <label>
                        Usuario
                        <input
                            type="text"
                            name="username"
                            placeholder="usuario@ucr.ac.cr"
                            value={form.username}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <label>
                        Contraseña
                        <input
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <div className="login-actions">
                        <button type="submit" className="btn-login" disabled={submitting}>
                            {submitting ? "Ingresando" : "Login"}
                        </button>
                    </div>

                    <div className="login-links">
                        <label>
                            ¿No tienes una cuenta?
                            <a href="/Registro"> Click aquí</a>
                        </label>
                    </div>

                    {(localError || secondsLeft > 0) && (
                        <p className="error" role="alert" aria-live="polite">
                            {secondsLeft > 0
                                ? `Cuenta bloqueada. Intenta en ${formatMMSS(secondsLeft)}`
                                : localError}
                        </p>
                    )}
                </form>
            </div>
        </section>
    );
}

export default Login;

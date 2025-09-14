import { useAuth } from "../../context/useAuth.js";
import "./Login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:8080";

function Login() {
    const { login, error } = useAuth();
    const [form, setForm] = useState({ username: "", password: "" });
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch(`${API}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error(res.status === 401 ? "Credenciales inválidas" : "Error en servidor");
        const data = await res.json(); // { token, user }
        login(data.user, data.token);

        if (data.user.roles.includes("DIRECTOR")) navigate("/Director");
        else if (data.user.roles.includes("ADMINISTRADOR")) navigate("/Administrador");
        else navigate("/dashboard");
    };

    return (
        <section className="login-container">
            <div className="login-card">
                <h2>Bienvenidos</h2>
                <h3>Iniciar Sesión</h3>

                <form onSubmit={handleSubmit} className="login-form">
                    <label>
                        Usuario
                        <input type="text" name="username" placeholder="usuario@ucr.ac.cr"
                               value={form.username} onChange={handleChange} required/>
                    </label>

                    <label>
                        Contraseña
                        <input type="password" name="password" placeholder="••••••••"
                               value={form.password} onChange={handleChange} required/>
                    </label>

                    <div className="login-actions">
                        <button type="submit" className="btn-login">Login</button>
                    </div>

                    <div className="login-links">
                        <label> ¿No tienes una cuenta?
                            <a href="/Registro"> Click aquí</a>
                        </label>
                    </div>

                    {error && <p className="error">{error}</p>}
                </form>
            </div>
        </section>
    );
}

export default Login;

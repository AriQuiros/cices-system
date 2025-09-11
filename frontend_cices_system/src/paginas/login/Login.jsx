import { useState } from "react";
import "./Login.css";

function Login() {
    const [form, setForm] = useState({ email: "", password: "" });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        //conectar con backend /auth/login
        console.log("Login intent", form);
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
                            type="email"
                            name="email"
                            placeholder="usuario@ucr.ac.cr"
                            required
                            value={form.email}
                            onChange={handleChange}
                        />
                    </label>

                    <label>
                        Contraseña
                        <input
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            required
                            value={form.password}
                            onChange={handleChange}
                        />
                    </label>

                    <button type="submit" className="btn-login">Login</button>
                </form>

                <div className="login-links">
                    <label> ¿No tienes una cuenta?
                        <a href="/registrar"> Click aquí</a>
                    </label>
                </div>
            </div>
        </section>
    );
}

export default Login;

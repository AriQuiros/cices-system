import "./Login.css";
import { Link } from "react-router-dom";
import { useLoginForm } from "../../hooks/authHooks/useLoginForm.js";

/**
 * Página de inicio de sesión.
 *
 * Solo contiene la estructura visual (HTML + CSS).
 * Toda la lógica vive en useLoginForm.
 */
function Login() {
    const {
        form,
        handleChange,
        handleSubmit,
        isPending,
        errorDisplay,
        hasError,
    } = useLoginForm();

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
                            id="login-username"
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
                            id="login-password"
                            name="password"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <div className="login-actions">
                        <button
                            type="submit"
                            id="login-submit"
                            className="btn-login"
                            disabled={isPending}
                        >
                            {isPending ? "Ingresando…" : "Login"}
                        </button>
                    </div>

                    <div className="login-links">
                        <label>
                            ¿No tienes una cuenta?
                            <Link to="/registro"> Click aquí</Link>
                        </label>
                        <div>
                            <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
                        </div>
                    </div>

                    {hasError && (
                        <p className="error" role="alert" aria-live="polite">
                            {errorDisplay}
                        </p>
                    )}
                </form>
            </div>
        </section>
    );
}

export default Login;

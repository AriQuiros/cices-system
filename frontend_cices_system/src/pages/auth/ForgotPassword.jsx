import InputField from "../../utils/ui/InputField.jsx";
import { required, correoUCR, maxLength } from "../../validators/Validators.jsx";
import { useForgotPasswordForm } from "../../hooks/authHooks/useForgotPasswordForm.js";
import { Link } from "react-router-dom";
import "./ForgotPassword.css";

export default function ForgotPassword() {
    const {
        correo,
        handleChange,
        handleSubmit,
        isPending,
        mensaje,
        isError,
    } = useForgotPasswordForm();

    return (
        <div className="forgot-password-page">
            <div className="forgot-card">
                <h2 className="forgot-title">Recuperar contraseña</h2>
                <p className="forgot-subtitle">Ingrese el correo registrado</p>

                <form className="forgot-form" onSubmit={handleSubmit}>
                    <InputField
                        label="Correo electrónico"
                        type="email"
                        name="correo"
                        placeholder="ejemplo@ucr.ac.cr"
                        value={correo}
                        onChange={handleChange}
                        rules={[required(), correoUCR(), maxLength(254)]}
                        maxLength={254}
                        required
                    />

                    <div className="forgot-actions">
                        <Link to="/" className="btn-secondary">
                            Volver a inicio
                        </Link>

                        <button
                            className="btn-primary"
                            type="submit"
                            disabled={isPending}
                        >
                            {isPending ? "Enviando…" : "Enviar enlace"}
                        </button>
                    </div>
                </form>

                {mensaje && (
                    <p
                        className={
                            isError
                                ? "forgot-message forgot-message-error"
                                : "forgot-message"
                        }
                        role="alert"
                        aria-live="polite"
                    >
                        {mensaje}
                    </p>
                )}
            </div>
        </div>
    );
}
import InputField from "../../utils/ui/InputField.jsx";
import { required, minLength, maxLength, match } from "../../validators/Validators.jsx";
import { useResetPasswordForm } from "../../hooks/authHooks/useResetPasswordForm.js";
import "./ResetPassword.css";
import { Link } from "react-router-dom";

export default function ResetPassword() {
    const {
        password,
        confirmPassword,
        handlePasswordChange,
        handleConfirmChange,
        handleSubmit,
        isPending,
        mensaje,
        isError,
    } = useResetPasswordForm();

    return (
        <div className="reset-password-page">
            <div className="reset-card">
                <h2 className="reset-title">Nueva contraseña</h2>
                <p className="reset-subtitle">
                    Defina una contraseña nueva para continuar
                </p>

                <form className="reset-form" onSubmit={handleSubmit}>
                    <InputField
                        label="Nueva contraseña"
                        type="password"
                        name="password"
                        placeholder="Mínimo 8 caracteres"
                        value={password}
                        onChange={handlePasswordChange}
                        rules={[required(), minLength(8), maxLength(254)]}
                        maxLength={32}
                        required
                    />

                    <InputField
                        label="Confirmar contraseña"
                        type="password"
                        name="confirmPassword"
                        placeholder="Repetir contraseña"
                        value={confirmPassword}
                        onChange={handleConfirmChange}
                        rules={[
                            required(),
                            match(() => password, "Las contraseñas no coinciden"),
                            maxLength(254),
                        ]}
                        maxLength={32}
                        required
                    />

                    <div className="reset-actions">
                        <Link to="/" className="btn-secondary">
                            Volver al inicio de sesión
                        </Link>
                        <button
                            className="btn-primary"
                            type="submit"
                            disabled={isPending}
                        >
                            {isPending ? "Actualizando…" : "Actualizar"}
                        </button>
                    </div>
                </form>

                {mensaje && (
                    <p
                        className={
                            isError
                                ? "reset-message reset-message-error"
                                : "reset-message"
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
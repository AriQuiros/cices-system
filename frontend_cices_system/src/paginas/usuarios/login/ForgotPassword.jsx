import InputField from "../../../utils/validaciones/InputField.jsx";
import { required, correoUCR, maxLength } from "../../../utils/validaciones/Validators.jsx";
import { useForgotPasswordForm } from "../../../modules/auth/hooks/useForgotPasswordForm";

/**
 * Página de recuperación de contraseña.
 *
 * Solo contiene la estructura visual (HTML + CSS).
 * Toda la lógica vive en useForgotPasswordForm.
 */
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
        <div>
            <h2>Recuperar contraseña</h2>
            <p>Ingrese el correo registrado</p>

            <form onSubmit={handleSubmit}>
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

                <button type="submit" disabled={isPending}>
                    {isPending ? "Enviando…" : "Enviar enlace"}
                </button>
            </form>

            {mensaje && (
                <p className={isError ? "error" : "success"} role="alert" aria-live="polite">
                    {mensaje}
                </p>
            )}
        </div>
    );
}

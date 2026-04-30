import InputField from "../../../utils/validaciones/InputField.jsx";
import { required, minLength, maxLength, match } from "../../../utils/validaciones/Validators.jsx";
import { useResetPasswordForm } from "../../../modules/auth/hooks/useResetPasswordForm";

/**
 * Página de nueva contraseña (reset).
 *
 * Solo contiene la estructura visual (HTML + CSS).
 * Toda la lógica vive en useResetPasswordForm.
 */
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
        <div>
            <h2>Nueva contraseña</h2>

            <form onSubmit={handleSubmit}>
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

                <button type="submit" disabled={isPending}>
                    {isPending ? "Actualizando…" : "Actualizar"}
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

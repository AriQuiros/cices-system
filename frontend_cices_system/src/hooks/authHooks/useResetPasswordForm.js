import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useResetPassword } from "./mutations/useResetPassword.js";

/**
 * Orquestador del formulario de nueva contraseña.
 *
 * Responsabilidades:
 *  - Extracción del token desde los query params de la URL
 *  - Estado de los campos de contraseña y confirmación
 *  - Validación previa del token antes de llamar al servicio
 *  - Llamada al servicio de reset-password via el hook de mutación
 *  - Gestión de mensajes de éxito y error
 *  - Estado de carga (isPending) para deshabilitar el botón
 *
 * El componente ResetPassword.jsx solo consume este hook y renderiza la UI.
 */
export const useResetPasswordForm = () => {
    const { mutate, isPending } = useResetPassword();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [isError, setIsError] = useState(false);

    // ─── Handlers ────────────────────────────────────────────────────────────

    const handlePasswordChange = (e) => {
        setMensaje("");
        setPassword(e.target.value);
    };

    const handleConfirmChange = (e) => {
        setMensaje("");
        setConfirmPassword(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setMensaje("");

        if (!token) {
            setIsError(true);
            setMensaje("Token inválido o expirado. Solicita un nuevo enlace.");
            return;
        }

        mutate(
            { token, password },
            {
                onSuccess: (data) => {
                    setIsError(false);
                    setMensaje(data || "Contraseña actualizada correctamente.");
                },
                onError: () => {
                    setIsError(true);
                    setMensaje(
                        "No se pudo actualizar la contraseña. El enlace puede haber expirado."
                    );
                },
            }
        );
    };

    // ─── API pública del hook ─────────────────────────────────────────────────

    return {
        password,
        confirmPassword,
        handlePasswordChange,
        handleConfirmChange,
        handleSubmit,
        isPending,
        mensaje,
        isError,
        tokenPresente: !!token,
    };
};

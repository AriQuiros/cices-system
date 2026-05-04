import { useState } from "react";
import { useForgotPassword } from "./mutations/useForgotPassword.js";

/**
 * Orquestador del formulario de recuperación de contraseña.
 *
 * Responsabilidades:
 *  - Estado del campo de correo electrónico
 *  - Llamada al servicio de forgot-password via el hook de mutación
 *  - Gestión de mensajes de éxito y error
 *  - Estado de carga (isPending) para deshabilitar el botón
 *
 * El componente ForgotPassword.jsx solo consume este hook y renderiza la UI.
 */
export const useForgotPasswordForm = () => {
    const { mutate, isPending } = useForgotPassword();

    const [correo, setCorreo] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [isError, setIsError] = useState(false);

    // ─── Handlers ────────────────────────────────────────────────────────────

    const handleChange = (e) => {
        setMensaje("");
        setCorreo(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setMensaje("");

        mutate(correo, {
            onSuccess: (data) => {
                setIsError(false);
                setMensaje(data || "Solicitud procesada. Revisa tu correo.");
            },
            onError: () => {
                setIsError(true);
                setMensaje("Error al enviar la solicitud. Intenta nuevamente.");
            },
        });
    };

    // ─── API pública del hook ─────────────────────────────────────────────────

    return {
        correo,
        handleChange,
        handleSubmit,
        isPending,
        mensaje,
        isError,
    };
};

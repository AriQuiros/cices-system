import { useState } from "react";
import { Link } from "react-router-dom";
import InputField from "../../../utils/validaciones/InputField.jsx";
import { required, pattern, maxLength } from "../../../utils/validaciones/Validators.jsx";
import "./ForgotPassword.css";

export default function ForgotPassword() {
    const [correo, setCorreo] = useState("");
    const [mensaje, setMensaje] = useState("");
    const esMensajeErrorCorreo = mensaje === "No existe un usuario activo asociado a este correo";

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(
                `http://localhost:8080/auth/forgot-password?correo=${correo}`,
                { method: "POST" }
            );

            const data = await res.text();

            setMensaje(data || (res.ok ? "Solicitud procesada" : "Error en la solicitud"));

        } catch {
            setMensaje("Error al enviar la solicitud");
        }
    };

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
                        placeholder="ejemplo@correo.com"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        rules={[required(), pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Formato de email inválido"), maxLength(254)]}
                        maxLength={254}
                        required
                    />

                    <div className="forgot-actions">
                        <Link to="/" className="btn-secondary">
                            Volver a inicio
                        </Link>
                        <button className="btn-primary" type="submit">Enviar enlace</button>
                    </div>
                </form>

                {mensaje && (
                    <p className={esMensajeErrorCorreo ? "forgot-message forgot-message-error" : "forgot-message"}>
                        {mensaje}
                    </p>
                )}
            </div>
        </div>
    );
}
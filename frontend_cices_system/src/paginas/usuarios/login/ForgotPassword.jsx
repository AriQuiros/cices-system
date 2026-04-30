import { useState } from "react";
import InputField from "../../../utils/validaciones/InputField.jsx";
import { required, pattern, maxLength } from "../../../utils/validaciones/Validators.jsx";

export default function ForgotPassword() {
    const [correo, setCorreo] = useState("");
    const [mensaje, setMensaje] = useState("");

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
        <div>
            <h2>Recuperar contraseña</h2>
            <p>Ingrese el correo registrado</p>

            <form onSubmit={handleSubmit}>

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

                <button type="submit">Enviar enlace</button>
            </form>

            {mensaje && <p>{mensaje}</p>}
        </div>
    );
}
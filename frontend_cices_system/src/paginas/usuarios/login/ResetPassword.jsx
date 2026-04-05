import { useState } from "react";
import InputField from "../../../utils/validaciones/InputField.jsx";
import { required, minLength, maxLength, match } from "../../../utils/validaciones/Validators.jsx";

export default function ResetPassword() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [mensaje, setMensaje] = useState("");

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!token) {
            setMensaje("Token inválido");
            return;
        }

        try {
            const res = await fetch("http://localhost:8080/auth/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token: token,
                    nuevaPassword: password,
                }),
            });

            const data = await res.text();

            setMensaje(data || (res.ok ? "Contraseña actualizada" : "Error"));

        } catch {
            setMensaje("Error o enlace expirado");
        }
    };

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
                    onChange={(e) => setPassword(e.target.value)}
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
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    rules={[
                        required(),
                        match(() => password, "Las contraseñas no coinciden"),
                        maxLength(254),
                    ]}
                    maxLength={32}
                    required
                />

                <button type="submit">Actualizar</button>
            </form>

            {mensaje && <p>{mensaje}</p>}
        </div>
    );
}
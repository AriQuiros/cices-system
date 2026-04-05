import React, { useState } from "react";
import "./Registro.css";

import { EmpleadoProvider }    from "../../../context/empleadoCtx/EmpleadoProvider.jsx";
import { InvestigadorProvider } from "../../../context/investigadorCtx/InvestigadorProvider.jsx";

import { useRegistro }          from "../../../hooks/usuarios/useRegistro";
import { buildPayloadRegistro } from "../../../services/EmpleadoService.jsx";

import FormularioUsuario from "./FormularioUsuario.jsx";

/** Clases CSS que Registro aplica a cada parte del formulario. */
const CLASES_REGISTRO = {
    contenedor:        "form-container",
    form:              "form-content",
    titulo:            "",
    fila:              "row",
    grupoInput:        "input-group",
    label:             "input-label",
    passwordContainer: "password-container",
    passwordToggle:    "password-toggle-btn",
    rolLabel:          "round-checkbox",
    roles:             "roles",
    btnSubmit:         "submit-btn",
    btnEditar:         "",            // no aplica en registro
    btnLogin:          "btn-link-login",
    authModal:         "",            // no aplica en registro
    authBox:           "",            // no aplica en registro
};

function RegistroInner() {
    const {
        empleado, usuario, investigador,
        tipos, rolesBD, loading,
        handleChange, handleCodigoChange,
        actualizarCampo, actualizarCampoUsuario,
        handleSubmit,
    } = useRegistro({ modoPerfil: false });

    const [confirmarContrasena, setConfirmarContrasena] = useState("");

    const onSubmit = (e) => {
        e.preventDefault();
        const payload = buildPayloadRegistro({ empleado, usuario, investigador });
        handleSubmit(payload, null);
    };

    return (
        <FormularioUsuario
            empleado={empleado}
            usuario={usuario}
            investigador={investigador}
            tipos={tipos}
            rolesBD={rolesBD}
            loading={loading}
            handleChange={handleChange}
            handleCodigoChange={handleCodigoChange}
            actualizarCampo={actualizarCampo}
            actualizarCampoUsuario={actualizarCampoUsuario}
            onSubmit={onSubmit}
            modoPerfil={false}
            confirmarContrasena={confirmarContrasena}
            setConfirmarContrasena={setConfirmarContrasena}
            clases={CLASES_REGISTRO}
        />
    );
}

export default function Registro() {
    return (
        <EmpleadoProvider>
            <InvestigadorProvider>
                <RegistroInner />
            </InvestigadorProvider>
        </EmpleadoProvider>
    );
}

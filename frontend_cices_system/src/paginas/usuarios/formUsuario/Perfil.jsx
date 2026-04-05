import React from "react";

import { EmpleadoProvider }    from "../../../context/empleadoCtx/EmpleadoProvider.jsx";
import { InvestigadorProvider } from "../../../context/investigadorCtx/InvestigadorProvider.jsx";

import { useRegistro }          from "../../../hooks/usuarios/useRegistro";
import { useAuthConfirm }       from "../../../hooks/usuarios/useAuthConfirm";
import { buildPayloadRegistro } from "../../../services/EmpleadoService.jsx";
import { AppContext }            from "../../../context/AppContext.jsx";

import FormularioUsuario from "./FormularioUsuario.jsx";

/**
 * Clases CSS para la página de Perfil.
 * De momento están vacías — agregar las clases propias de Perfil aquí
 * cuando se defina el CSS correspondiente.
 */
const CLASES_PERFIL = {
    contenedor: "",
    form:       "",
    titulo:     "",
    fila:       "",
    grupoInput: "",
    label:      "",
    btnSubmit:  "",
    btnEditar:  "",
    roles:      "",
    authModal:  "",
    authBox:    "",
};

function PerfilInner() {
    const {
        empleado, usuario, investigador,
        tipos, rolesBD, loading,
        handleChange, handleCodigoChange,
        actualizarCampo, actualizarCampoUsuario,
        handleSubmit,
    } = useRegistro({ modoPerfil: true });

    const { user } = React.useContext(AppContext);

    const {
        requiereAuth,
        authPassword,
        authOk,
        setRequiereAuth,
        setAuthPassword,
        handleReAuth,
    } = useAuthConfirm(user);

    const onSubmit = (e) => {
        e.preventDefault();
        const payload = buildPayloadRegistro({ empleado, usuario, investigador });
        handleSubmit(payload, authPassword);
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
            modoPerfil={true}
            authOk={authOk}
            requiereAuth={requiereAuth}
            authPassword={authPassword}
            setRequiereAuth={setRequiereAuth}
            setAuthPassword={setAuthPassword}
            handleReAuth={handleReAuth}
            user={user}
            clases={CLASES_PERFIL}
        />
    );
}

export default function Perfil() {
    return (
        <EmpleadoProvider>
            <InvestigadorProvider>
                <PerfilInner />
            </InvestigadorProvider>
        </EmpleadoProvider>
    );
}

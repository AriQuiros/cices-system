// src/paginas/usuarios/formUsuario/Perfil.jsx
import { useContext } from "react";
import { AppContext } from "../../../context/AppContext.jsx";
import { useFormularioUsuario } from "../../../modules/usuario/hooks/useFormularioUsuario.js";
import FormularioUsuario from "./FormularioUsuario.jsx";
import "./Perfil.css";

const CLASES_PERFIL = {
    contenedor: "perfil-container",
    form:       "perfil-form",
    titulo:     "perfil-title",
    fila:       "perfil-row",
    grupoInput: "perfil-input-group",
    label:      "perfil-label",
    btnSubmit:  "perfil-btn-submit",
    btnEditar:  "perfil-btn-editar",
    roles:      "perfil-roles",
    authModal:  "perfil-auth-modal",
    authBox:    "perfil-auth-box",
    phoneCss:   "phone-input-control"
};

export default function Perfil() {
    const { user } = useContext(AppContext);

    const form = useFormularioUsuario({ modoPerfil: true });

    return (
        <FormularioUsuario
            {...form}
            onSubmit={form.handleSubmit}
            modoPerfil={true}
            user={user}
            clases={CLASES_PERFIL}
        />
    );
}
// src/paginas/usuarios/formUsuario/Registro.jsx
import { useFormularioUsuario } from "../../hooks/usuarioHooks/useFormularioUsuario.js";
import FormularioUsuario from "./FormularioUsuario.jsx";
import "./Registro.css";
import "../../estilos/form.css";

const CLASES_REGISTRO = {
    contenedor:        "form-container",
    form:              "form-content",
    titulo:            "perfil-title",
    fila:              "row",
    grupoInput:        "input-group",
    label:             "input-label",
    passwordContainer: "password-container",
    passwordToggle:    "password-toggle-btn",
    rolLabel:          "round-checkbox",
    roles:             "roles",
    btnSubmit:         "submit-btn",
    btnEditar:         "",
    btnLogin:          "btn-link-login",
    authModal:         "",
    authBox:           "",
    phoneCss:          "phone-input-control"
};

export default function Registro() {
    const form = useFormularioUsuario({ modoPerfil: false });

    return (
        <FormularioUsuario
            {...form}
            onSubmit={form.handleSubmit}
            modoPerfil={false}
            clases={CLASES_REGISTRO}
        />
    );
}
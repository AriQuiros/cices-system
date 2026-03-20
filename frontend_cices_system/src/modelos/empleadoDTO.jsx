import { CodigoDTO } from "./codigoDTO.jsx";

export const RolDTO = {
    id: null,
    nombreRol: ""
};

export const UsuarioDTO = {
    id: null,
    nombreUsuario: "",
    contrasena: "",
    roles: []
};

export const EmpleadoDTO = {
    id: null,
    nombreCompleto: "",
    identificacion: "",
    tipoId: { ...CodigoDTO },
    pais: "",
    correo: "",
    numeroTelefono: "",
    gradoAcademico: { ...CodigoDTO },
    usuario: { ...UsuarioDTO }
};
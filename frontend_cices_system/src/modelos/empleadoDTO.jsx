export const UsuarioDTO = {
    nombreUsuario: "",
    contrasena: "",
    roles: []
};

export const EmpleadoDTO = {
    nombreCompleto: "",
    identificacion: "",
    tipoId: "",
    pais: "",
    correo: "",
    numeroTelefono: "",
    gradoAcademico: "",
    usuario: { ...UsuarioDTO }
};
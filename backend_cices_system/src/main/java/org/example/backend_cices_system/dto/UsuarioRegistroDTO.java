package org.example.backend_cices_system.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UsuarioRegistroDTO {
    private String nombreCompleto;
    private String nacionalidad;
    private Short idCodigoTipoId;
    private String identificacion;
    private String correo;
    private String telefono;
    private String nombreUsuario;
    private String contrasena;
    private java.util.List<String> roles;
    private String numeroBecario;
    private String unidadAcademica;
    private String institucionOrigen;
    private Short idCodigoGradoAcademico;
    private java.util.List<AcreditacionDTO> acreditaciones;

    public UsuarioRegistroDTO() {
    }
    @Getter
    @Setter
    public static class AcreditacionDTO {
        private String text;
        private String date;
    }
}
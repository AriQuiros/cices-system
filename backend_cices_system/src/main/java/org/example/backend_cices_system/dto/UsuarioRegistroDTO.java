package org.example.backend_cices_system.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;
import org.example.backend_cices_system.logic.Certificacion;

import java.time.LocalDate;
import java.util.List;

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
    private List<String> roles;

    // Campos de investigador
    private String numeroBecario;
    private String unidadAcademica;
    private String institucionOrigen;
    private Short idCodigoGradoAcademico;

    // <-- aquí el tipo correcto
    private List<AcreditacionDTO> acreditaciones;

    @Getter @Setter
    public static class AcreditacionDTO {
        // formato "nuevo" del front
        private String nombreCertificacion;
        private Short idCodigoTipoCertificacion;
        @JsonFormat(pattern = "yyyy-MM-dd")
        private LocalDate fechaExpiracion;
        private Short idCodigoTipoEstado;

        // alias "legacy" por si llegan text/date
        private String text;
        private String date;
    }
}
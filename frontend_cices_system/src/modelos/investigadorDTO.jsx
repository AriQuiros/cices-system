import { EmpleadoDTO } from "./empleadoDTO.jsx";
import { EntidadDTO } from "./entidadDTO.jsx";

export const InvestigadorDTO = {
    empleado: { ...EmpleadoDTO },
    institucionOrigen: { ...EntidadDTO, tipo: "INSTITUCION" },
    unidadAcademica: { ...EntidadDTO, tipo: "UNIDAD" },
    temaInteres: "",
    titulos: [],
    certificaciones: []
};

export const TituloDTO = {
    entidadEmisora: { ...EntidadDTO, tipo: "INSTITUTION" },
    nombreTitulo: "",
    nivelTitulo: "",
    fechaEmision: ""
};

export const CertificacionDTO = {
    entidadEmisora: { ...EntidadDTO, tipo: "INSTITUTION" },
    nombreCertificacion: "",
    tipoCertificacion: "",
    fechaExpiracion: "",
    estado: ""
};

export const InvestigadorProyectoDTO = {
    identificacionInvestigador: "",
    nombreInvestigador: "",
    rolProyecto: "",
    actividadProyecto: "",
    fechaInicio: "",
    fechaFin: "",
    horasAsignadas: []
};
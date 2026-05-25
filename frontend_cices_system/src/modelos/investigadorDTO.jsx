import { EmpleadoDTO } from "./empleadoDTO.jsx";
import { EntidadDTO } from "./entidadDTO.jsx";
import {CodigoDTO} from "./codigoDTO.jsx";

export const InvestigadorDTO = {
    id: null,
    empleado: { ...EmpleadoDTO },
    institucionOrigen: { ...EntidadDTO, tipo: "INSTITUCION" },
    unidadAcademica: { ...EntidadDTO, tipo: "UNIDAD" },
    temaInteres: "",
    titulos: [],
    certificaciones: []
};

export const TituloDTO = {
    id: null,
    entidadEmisora: { ...EntidadDTO },
    nombreTitulo: "",
    nivelTitulo: { ...CodigoDTO },
    fechaEmision: ""
};

export const CertificacionDTO = {
    id: null,
    entidadEmisora: { ...EntidadDTO },
    nombreCertificacion: "",
    tipoCertificacion: { ...CodigoDTO },
    fechaExpiracion: "",
    estado: { ...CodigoDTO }
};

import { CodigoDTO } from "./codigoDTO.jsx";

export const MetaDTO = {
    id: null,
    tipo: { ...CodigoDTO },
    cantidad: 1,
    descripcion: "",
    indicadores: [""]
};

export const ObjetivoEspecificoDTO = {
    id: null,
    categoria: "",
    descripcion: "",
    metas: [{ ...MetaDTO }]
};

export const DocumentoDTO = {
    id: null,
    nombreDocumento: "",
    directorio: ""
};

export const InformeDTO = {
    id: null,
    tipoInforme: { ...CodigoDTO },
    fechaPresentacion: "",
    estado: { ...CodigoDTO }
};

export const ProyectoDTO = {
    codigoProyecto: "",
    nombreProyecto: "",
    descripcion: "",
    objetivoGeneral: "",
    fechaInicio: "",
    fechaFinalizacion: "",
    lineaInvestigacion: "",
    tipoProyecto: { ...CodigoDTO },
    estado: { ...CodigoDTO },
    detalles: "",

    objetivosEspecificos: [{...ObjetivoEspecificoDTO}],
    presupuestos: [],
    documentos: [],
    entidadesVinculadas: {
        instituciones: [{ nombre: "" }],
        unidades: [{ nombre: "" }],
        sitios: [{ nombre: "" }]
    },
    presentacionesInformes: [],
    investigadoresVinculados: []
};
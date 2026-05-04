import { CodigoDTO } from "./codigoDTO.jsx";

export const IndicadorDTO = {
    id: null,
    descripcion: ""
};

export const MetaDTO = {
    id: null,
    tipo: { ...CodigoDTO },
    cantidad: 1,
    descripcion: "",
    indicadores: [{...IndicadorDTO}]
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
    url: ""
};

export const InformeDTO = {
    id: null,
    tipoInforme: { ...CodigoDTO },
    fechaPresentacion: "",
    estado: { ...CodigoDTO }
};

export const ProyectoDTO = {
    id:null,
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
    presentacionesInformes: [{ ...InformeDTO }],
    investigadoresVinculados: []
};
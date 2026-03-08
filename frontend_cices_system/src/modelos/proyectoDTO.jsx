export const MetaDTO = {
    idMeta: null,
    tipo: "", // CUANTITATIVA o CUALITATIVA
    cantidad: null,
    descripcion: "",
    indicadores: [""]
};

export const ObjetivoEspecificoDTO = {
    idObjetivo: null,
    categoria: "",
    descripcion: "",
    metas: [{ ...MetaDTO }]
};

export const DocumentoDTO = {
    idDocumento: "",
    nombreDocumento: "",
    directorio: ""
};

export const InformeDTO = {
    idInforme: null,
    tipoInforme: "", // Inicial, Final
    fechaPresentacion: "",
    estado: "" // Pendiente o entregado
};

export const ProyectoDTO = {
    idProyecto: "",
    nombre: "",
    codigo: "",
    descripcion: "",
    objetivoGeneral: "",
    fechaInicio: "",
    fechaFinalizacion: "",
    lineaInvestigacion: "",
    tipoProyecto: "",
    estado: "",
    detalles: "",

    objetivosEspecificos: [{ ...ObjetivoEspecificoDTO }],
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
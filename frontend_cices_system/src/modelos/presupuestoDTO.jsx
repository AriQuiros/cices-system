export const PresupuestoDTO = {
    idPresupuesto: null,
    codigoProyecto: "",
    fechaAsignacion: "",
    tipoPresupuesto: "",
    categoria: "",
    descripcion: "",
    fuenteFinanciamiento: "",
    monto: 0,
    cantidadHorasMes: 0,
    cantidadMeses: 0
};

export const HorasAsignadasDTO = {
    presupuesto:{...PresupuestoDTO},
    modalidad: "",
    tipoHora: "",
    cantidadHorasMes: 0,
    cantidadMeses: 0
};

export const GastosDTO = {
    presupuesto:{...PresupuestoDTO},
    monto: 0,
    descripcion: "",
    fechaGasto: ""
};


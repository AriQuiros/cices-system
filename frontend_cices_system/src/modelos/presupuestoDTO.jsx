import { CodigoDTO } from "./codigoDTO.jsx";

export const PresupuestoDTO = {
    id: null,
    descripcion: "",
    categoria: { ...CodigoDTO },
    fechaAsignacion: "",
    tipoPresupuesto: { ...CodigoDTO },
    fuenteFinanciamiento: { ...CodigoDTO },
    monto: 0,
    cantidadHorasMes: 0,
    cantidadMeses: 0,

    gastos:[],
    horas:[]
};

export const HorasAsignadasDTO = {
    id: null,
    idPresupuesto: null,
    modalidad: { ...CodigoDTO },
    tipoHora: { ...CodigoDTO },
    cantidadHorasMes: 0,
    cantidadMeses: 0
};

export const GastoDTO = {
    id: null,
    idPresupuesto: null,
    monto: 0,
    descripcion: "",
    fechaGasto: ""
};


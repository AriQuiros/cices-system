export const RolProyectoDTO = {
    id: null,
    nombreRolProyecto: ""
};

export const InvestigadorProyectoDTO = {
    id: null,
    identificacionInvestigador: "",
    nombreInvestigador: "",
    codigoProyecto: "",
    rolProyecto: { ...RolProyectoDTO },
    actividadProyecto: "",
    fechaInicio: "",
    fechaFin: "",
};
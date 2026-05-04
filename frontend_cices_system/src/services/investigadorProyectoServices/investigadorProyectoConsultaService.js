import {
    obtenerProyectosInvestigador,
    listarInvestigadorProyecto,
    obtenerInvestigadoresPorProyecto
} from "../../api/investigadorProyectoApi/investigadorProyectoConsultaApi.js";

// consultas
export const obtenerProyectosInvestigadorSrv = async (texto, soloPrincipalOPermiso, pageable) => {
    const res = await obtenerProyectosInvestigador(texto, soloPrincipalOPermiso, pageable);
    return res.data;
};

export const listarInvestigadorProyectoSrv = async (filtro, filtroInv, pageable) => {
    const res = await listarInvestigadorProyecto(filtro, filtroInv, pageable);
    return res.data;
};

export const obtenerInvestigadoresPorProyectoSrv = async (codigoProyecto, pageable, ordenPor, direccion) => {
    const res = await obtenerInvestigadoresPorProyecto(codigoProyecto, pageable, ordenPor, direccion);
    return res.data;
};
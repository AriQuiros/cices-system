import {
    asignarInvestigadorProyecto,
    actualizarInvestigadorProyecto,
    eliminarInvestigadorProyecto,
    obtenerInvestigadorProyecto
} from "../api/investigadorProyectoApi";

import {
    obtenerProyectosInvestigador,
    listarInvestigadorProyecto,
    obtenerInvestigadoresPorProyecto
} from "../api/investigadorProyectoConsultaApi";

// asignación masiva
export const asignarInvestigadorProyectoSrv = async (listDto) => {
    const res = await asignarInvestigadorProyecto(listDto);
    return res.data;
};

// update
export const actualizarInvestigadorProyectoSrv = async (dto) => {
    const res = await actualizarInvestigadorProyecto(dto);
    return res.data;
};

// delete
export const eliminarInvestigadorProyectoSrv = async (id) => {
    const res = await eliminarInvestigadorProyecto(id);
    return res.data;
};

// obtener uno
export const obtenerInvestigadorProyectoSrv = async (id) => {
    const res = await obtenerInvestigadorProyecto(id);
    return res.data;
};

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
import {
    asignarInvestigadorProyecto,
    actualizarInvestigadorProyecto,
    eliminarInvestigadorProyecto,
    obtenerInvestigadorProyecto
} from "../../api/investigadorProyectoApi/investigadorProyectoApi.js";

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

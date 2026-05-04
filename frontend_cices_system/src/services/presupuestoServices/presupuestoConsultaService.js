import {
    obtenerPresupuestoReporte,
    buscarPresupuestos,
    presupuestosPorProyectoTipo,
    presupuestosPorProyecto
} from "../../api/presupuestoApi/presupuestoConsultaApi.js";

export const obtenerPresupuestoDetalle = async (id) => {
    const res = await obtenerPresupuestoReporte(id);
    return res.data;
};

export const buscarPresupuestosSrv = async (filtro, pageable) => {
    const res = await buscarPresupuestos(filtro, pageable);
    return res.data?.content || res.data;
};

export const obtenerPresupuestosProyectoTipo = async (
    filtro,
    ordenamiento,
    pageable
) => {
    const res = await presupuestosPorProyectoTipo(
        filtro,
        ordenamiento,
        pageable
    );
    return res.data;
};

export const obtenerPresupuestosProyecto = async (
    filtro,
    ordenamiento,
    pageable
) => {
    const res = await presupuestosPorProyecto(
        filtro,
        ordenamiento,
        pageable
    );
    return res.data;
};
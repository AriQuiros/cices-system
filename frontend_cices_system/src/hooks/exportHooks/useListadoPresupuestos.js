import { useState } from "react";
import { usePresupuestosReporteQuery } from "./queries/usePresupuestosReporte.js";
import { useProyectosFiltros } from "../shared/useProyectosFiltros.js";
import { usePresupuestoFiltros } from "../presupuestoHooks/usePresupuestoFiltros.js"; // hook existente

export const useListadoPresupuestos = () => {
    const {
        filtroProyecto, cambiarFiltroProyecto, limpiarFiltros: limpiarProyecto,
        opcionesTipos, opcionesEstado, opcionesLineas
    } = useProyectosFiltros();

    const {
        filtroPresupuesto, cambiarFiltroPresupuesto, limpiarFiltros: limpiarPresupuesto,
        opcionesTiposPresupuesto, opcionesFuentes, opcionesCategorias
    } = usePresupuestoFiltros();

    const [pageable, setPageable] = useState({ page: 0, size: 8 });
    const [limite] = useState(3);
    const query = usePresupuestosReporteQuery(filtroProyecto, filtroPresupuesto, pageable, limite);

    const limpiarFiltros = () => {
        limpiarProyecto();
        limpiarPresupuesto();
        setPageable(prev => ({ ...prev, page: 0 }));
    };

    return {
        data: query.data?.content || [],
        totalElements: query.data?.totalElements || 0,
        totalPages: query.data?.totalPages || 0,
        isLoading: query.isLoading,
        isError: query.isError,

        filtroProyecto, cambiarFiltroProyecto,
        filtroPresupuesto, cambiarFiltroPresupuesto,
        limpiarFiltros,

        pageable,
        cambiarPagina: (p) => setPageable(prev => ({ ...prev, page: p })),

        opcionesTipos, opcionesEstado, opcionesLineas,
        opcionesTiposPresupuesto, opcionesFuentes, opcionesCategorias
    };
};
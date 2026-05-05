import { useState } from "react";
import { usePresupuestosReporteQuery } from "./queries/usePresupuestosReporte.js";
import { useProyectosFiltros } from "../shared/useProyectosFiltros.js";

export const useListadoPresupuestos = () => {
    const {
        filtroProyecto,
        cambiarFiltroProyecto,
        limpiarFiltros,
        opcionesTipos,
        opcionesEstado,
        opcionesLineas
    } = useProyectosFiltros();

    const [pageable, setPageable] = useState({ page: 0, size: 8 });
    const [limite] = useState(5);

    const query = usePresupuestosReporteQuery(filtroProyecto, pageable, limite);

    return {
        data: query.data?.content || [],
        totalElements: query.data?.totalElements || 0,
        totalPages: query.data?.totalPages || 0,
        isLoading: query.isLoading,
        isError: query.isError,

        filtroProyecto,
        cambiarFiltroProyecto,
        limpiarFiltros,

        pageable,
        cambiarPagina: (nuevaPagina) =>
            setPageable(prev => ({ ...prev, page: nuevaPagina })),

        opcionesTipos,
        opcionesEstado,
        opcionesLineas
    };
};
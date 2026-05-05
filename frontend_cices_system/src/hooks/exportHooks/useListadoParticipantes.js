import { useState } from "react";
import { useParticipantesQuery } from "./queries/useParticipantes.js";
import { useProyectosFiltros } from "../shared/useProyectosFiltros.js";

export const useListadoParticipantes = () => {

    const {
        filtroProyecto,
        cambiarFiltroProyecto,
        limpiarFiltros,
        opcionesTipos,
        opcionesEstado,
        opcionesLineas
    } = useProyectosFiltros();

    const [pageable, setPageable] = useState({
        page: 0,
        size: 8
    });

    const [limite] = useState(5);

    const query = useParticipantesQuery(filtroProyecto, pageable, limite);

    const data = query.data?.content || [];
    const totalElements = query.data?.totalElements || 0;
    const totalPages = query.data?.totalPages || 0;

    const cambiarPagina = (nuevaPagina) => {
        setPageable(prev => ({
            ...prev,
            page: nuevaPagina
        }));
    };

    return {
        data,
        totalElements,
        totalPages,
        isLoading: query.isLoading,
        isError: query.isError,

        filtroProyecto,
        cambiarFiltroProyecto,
        limpiarFiltros,

        pageable,
        cambiarPagina,

        opcionesTipos,
        opcionesEstado,
        opcionesLineas
    };
};
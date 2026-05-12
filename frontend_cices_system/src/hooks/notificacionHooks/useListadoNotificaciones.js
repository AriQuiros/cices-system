import { useState } from "react";
import { useNotificacionesQuery } from "./queries/useNotificaciones.js";
import { useCatalogos } from "../referenceDataHooks/useCatalogos.js";

const FILTRO_INICIAL = {
    categoria: "",
    leido: null,
    busqueda: ""
};

export const useListadoNotificaciones = () => {
    const [filtro, setFiltro]     = useState(FILTRO_INICIAL);
    const [pageable, setPageable] = useState({ page: 0, size: 10 });

    const query = useNotificacionesQuery(filtro, pageable);

    const data        = query.data?.content      || [];
    const totalPages  = query.data?.totalPages   || 0;
    const totalElements = query.data?.totalElements || 0;

    const catalogosQuery = useCatalogos(["CATEGORIA_NOTIFICACION"]);
    const catalogos = catalogosQuery.data?.data || catalogosQuery.data || {};
    const opcionesCategorias = [
        { value: "", label: "Todos los tipos" },
        ...(catalogos["CATEGORIA_NOTIFICACION"] || []).map(c => ({
            value: c.despliegue,
            label: c.despliegue
        }))
    ];

    const cambiarFiltro = (campo, valor) => {
        setFiltro(prev => ({ ...prev, [campo]: valor }));
        setPageable(prev => ({ ...prev, page: 0 })); // reset página al filtrar
    };

    const limpiarFiltros = () => {
        setFiltro(FILTRO_INICIAL);
        setPageable(prev => ({ ...prev, page: 0 }));
    };

    const cambiarPagina = (nuevaPagina) =>
        setPageable(prev => ({ ...prev, page: nuevaPagina }));

    return {
        data,
        totalPages,
        totalElements,
        isLoading: query.isLoading,
        isError:   query.isError,
        filtro,
        cambiarFiltro,
        limpiarFiltros,
        opcionesCategorias,
        pageable,
        cambiarPagina
    };
};
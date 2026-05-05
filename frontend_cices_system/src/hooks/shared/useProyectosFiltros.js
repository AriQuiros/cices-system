import { useState } from "react";
import { useCatalogos } from "../referenceDataHooks/useCatalogos.js";
import { useLineasInvestigacion } from "../proyectoHooks/queries/useLineasInvestigacion.js";

const FILTRO_INICIAL = {
    texto: "",
    estado: "",
    tipos: [],
    lineas: [],
    ordenFecha: "desc"
};

export const useProyectosFiltros = () => {

    const [filtroProyecto, setFiltroProyecto] = useState(FILTRO_INICIAL);

    // ── Catálogos ─────────────────────────────────────────
    const catalogosQuery = useCatalogos(["TIPO_PROYECTO", "ESTADO_PROYECTO"]);
    const catalogos = catalogosQuery.data?.data || catalogosQuery.data || {};

    const lineasQuery = useLineasInvestigacion();

    // ── Opciones ─────────────────────────────────────────
    const opcionesTipos = (catalogos["TIPO_PROYECTO"] || []).map(t => ({
        value: t.despliegue,
        label: t.despliegue
    }));

    const opcionesEstado = (catalogos["ESTADO_PROYECTO"] || []).map(t => ({
        value: t.despliegue,
        label: t.despliegue
    }));

    const opcionesLineas = (lineasQuery.data || []).map(l => ({
        value: l?.nombre ?? l,
        label: l?.nombre ?? l
    }));

    // ── Acciones ─────────────────────────────────────────
    const cambiarFiltroProyecto = (campo, valor) => {
        setFiltroProyecto(prev => ({
            ...prev,
            [campo]: valor
        }));
    };

    const limpiarFiltros = () => {
        setFiltroProyecto(FILTRO_INICIAL);
    };

    return {
        filtroProyecto,
        cambiarFiltroProyecto,
        limpiarFiltros,

        opcionesTipos,
        opcionesEstado,
        opcionesLineas,

        isLoadingCatalogos: catalogosQuery.isLoading || lineasQuery.isLoading
    };
};
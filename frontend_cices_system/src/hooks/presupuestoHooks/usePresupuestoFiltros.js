import { useState } from "react";
import { useCatalogos } from "../referenceDataHooks/useCatalogos.js";

const FILTRO_INICIAL = {
    busqueda: "",
    tipoPresupuesto: "",
    fuentesFinanciamiento: [],
    categorias: [],
    fechaDesde: null,
    fechaHasta: null
};

export const usePresupuestoFiltros = () => {

    const [filtroPresupuesto, setFiltroPresupuesto] = useState(FILTRO_INICIAL);

    // ── Catálogos ──────────────────────────────────────────────────────────
    const catalogosQuery = useCatalogos([
        "TIPO_PRESUPUESTO",
        "FUENTE_FINANCIAMIENTO",
        "CATEGORIA_PRESUPUESTO"
    ]);
    const catalogos = catalogosQuery.data?.data || catalogosQuery.data || {};

    // ── Opciones ──────────────────────────────────────────────────────────
    const opcionesTiposPresupuesto = (catalogos["TIPO_PRESUPUESTO"] || []).map(t => ({
        value: t.despliegue,
        label: t.despliegue
    }));

    const opcionesFuentes = (catalogos["FUENTE_FINANCIAMIENTO"] || []).map(t => ({
        value: t.despliegue,
        label: t.despliegue
    }));

    const opcionesCategorias = (catalogos["CATEGORIA_PRESUPUESTO"] || []).map(t => ({
        value: t.despliegue,
        label: t.despliegue
    }));

    // ── Acciones ──────────────────────────────────────────────────────────
    const cambiarFiltroPresupuesto = (campo, valor) => {
        setFiltroPresupuesto(prev => ({ ...prev, [campo]: valor }));
    };

    const limpiarFiltros = () => {
        setFiltroPresupuesto(FILTRO_INICIAL);
    };

    return {
        filtroPresupuesto,
        cambiarFiltroPresupuesto,
        limpiarFiltros,

        opcionesTiposPresupuesto,
        opcionesFuentes,
        opcionesCategorias,

        isLoadingCatalogos: catalogosQuery.isLoading
    };
};
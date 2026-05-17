import { useState } from "react";
import { useCatalogos } from "../referenceDataHooks/useCatalogos.js";

const ANIO_MIN = 2020;
const ANIO_MAX = new Date().getFullYear();

const FILTRO_INICIAL = {
    busqueda: "",
    tipoPresupuesto: "",
    fuentesFinanciamiento: [],
    categorias: [],
    anioDesde: ANIO_MIN,
    anioHasta: ANIO_MAX
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

        isLoadingCatalogos: catalogosQuery.isLoading,
        ANIO_MIN,
        ANIO_MAX
    };
};
import { useState, useEffect, useRef  } from "react";
import { usePresupuestosProyecto } from "./queries/usePresupuestosProyecto.js";
import { usePresupuesto } from "./queries/usePresupuesto.js";
import { usePresupuestoDetalle } from "./queries/usePresupuestoDetalle.js";
import { useRegistrarPresupuesto } from "./mutations/useRegistrarPresupuestos.js";
import { useActualizarPresupuesto } from "./mutations/useActualizarPresupuesto.js";
import { useCatalogos } from "../referenceDataHooks/useCatalogos.js";
import { PresupuestoDTO } from "../../modelos/presupuestoDTO.jsx";
import { CodigoDTO } from "../../modelos/CodigoDTO.jsx";
import { notify } from "../../utils/ui/notify.jsx";
import { confirm } from "../../utils/ui/confirm.jsx";

const MAX_FORM = 5;
const TIPO_HORAS_VALOR      = "HORAS";
const CAT_HORAS_VALOR       = "HORAS BECARIAS";

// ── Funciones puras ───────────────────────────────────────────────────────────

const obtenerAnio = (fecha) => fecha ? new Date(fecha).getFullYear() : null;

/**
 * Valida que no se repita categoria+año.
 * Compara:
 *   - existentes (PresupuestoReporteDTO → categoria es string)
 *   - form actual  (PresupuestoDTO      → categoria es CodigoDTO, usar .valor)
 * Si se está editando, excluye el presupuesto con ese id de los existentes.
 */
const validarCategoriasUnicas = (presupuestosForm, existentesContent, editandoId) => {
    const combos = new Set();

    existentesContent
        .filter(p => p.id !== editandoId)
        .forEach(p => {
            const anio = obtenerAnio(p.fechaAsignacion);
            if (p.categoria && p.categoria !== "OTRO" && anio)
                combos.add(`${p.categoria}|${anio}`); // despliegue
        });

    for (let i = 0; i < presupuestosForm.length; i++) {
        const p   = presupuestosForm[i];
        const cat = p.categoria?.despliegue;
        const anio = obtenerAnio(p.fechaAsignacion);

        if (!cat || cat === "OTRO" || !anio) continue;

        const combo = `${cat}|${anio}`;
        if (combos.has(combo)) {
            return `La categoría "${cat}" ya existe para el año ${anio}.`;
        }
        combos.add(combo);
    }

    return null;
};

// ── Hook ──────────────────────────────────────────────────────────────────────

export const useGestionPresupuesto = () => {
    const formRef = useRef(null);

    const [proyecto,         setProyecto]         = useState(null);
    const [presupuestosForm, setPresupuestosForm] = useState([{ ...PresupuestoDTO }]);
    const [editandoId,       setEditandoId]       = useState(null);
    const [pageable,         setPageable]         = useState({ page: 0, size: 3 });

    // ── Catálogos ─────────────────────────────────────────────────────────
    const catalogosQuery = useCatalogos([
        "TIPO_PRESUPUESTO",
        "CATEGORIA_PRESUPUESTO",
        "FUENTE_FINANCIAMIENTO"
    ]);
    const catalogos = catalogosQuery.data?.data ?? catalogosQuery.data ?? {};

    // ── Lista existente paginada (PresupuestoReporteDTO) ──────────────────
    const listadoQuery = usePresupuestosProyecto(
        { codigoProyecto: proyecto?.codigoProyecto },
        {},
        pageable
    );
    const paginaData         = listadoQuery.data || {};
    const existentesContent  = paginaData.content      || [];
    const totalElements      = paginaData.totalElements || 0;
    const totalPages         = paginaData.totalPages    || 0;

    // ── Edición: DTO formulario + resumen ─────────────────────────────────
    const formQuery    = usePresupuesto(editandoId);       // PresupuestoDTO (CodigoDTO)
    const detalleQuery = usePresupuestoDetalle(editandoId); // ReporteDTO (resumen con totalUsado)

    useEffect(() => {
        if (!formQuery.data) return;
        setPresupuestosForm([{ ...formQuery.data }]);
    }, [formQuery.data]);

    // ── Mutations ─────────────────────────────────────────────────────────
    const { mutate: registrar, isPending: registrando } = useRegistrarPresupuesto();
    const { mutate: actualizar, isPending: actualizando } = useActualizarPresupuesto();

    // ── Helpers estado formulario ─────────────────────────────────────────

    const setByPath = (path, value) => {
        setPresupuestosForm(prev => {
            const copia = structuredClone(prev);
            let ref = copia;
            // path: ["presupuestos", idx, "campo"]
            for (let i = 1; i < path.length - 1; i++) ref = ref[path[i]];
            ref[path[path.length - 1]] = value;
            return copia;
        });
    };

    const agregarPresupuesto = () => {
        if (presupuestosForm.length >= MAX_FORM) {
            notify.warning(`Máximo ${MAX_FORM} presupuestos por operación`);
            return;
        }
        setPresupuestosForm(prev => [...prev, { ...PresupuestoDTO }]);
    };

    const eliminarPresupuesto = (idx) => {
        setPresupuestosForm(prev => prev.filter((_, i) => i !== idx));
    };

    const handleCampoChange = (index, e) => {
        const { name, value } = e.target;
        const v = ["monto", "cantidadHorasMes", "cantidadMeses"].includes(name)
            ? (value === "" ? "" : Number(value))
            : value;
        setByPath(["presupuestos", index, name], v);
    };

    const handleTipoChange = (index, tipoObj) => {
        const categoriaHoras = (catalogos["CATEGORIA_PRESUPUESTO"] || [])
            .find(c => c.valor === CAT_HORAS_VALOR);

        setPresupuestosForm(prev => {
            const copia = structuredClone(prev);
            copia[index] = {
                ...copia[index],
                tipoPresupuesto: tipoObj,
                ...(tipoObj.valor === "FINANCIERO" && {
                    cantidadHorasMes: 0,
                    cantidadMeses: 0,
                    categoria: { ...CodigoDTO }
                }),
                ...(tipoObj.valor === TIPO_HORAS_VALOR && {
                    monto: 0,
                    fuenteFinanciamiento: { ...CodigoDTO },
                    categoria: categoriaHoras || { ...CodigoDTO }
                })
            };
            return copia;
        });
    };

    // Categorías disponibles para cada fila del form
    // Regla: HORAS → solo CAT_HORAS; FINANCIERO → todas excepto combos categoria+año ya usados
    const getCategoriasDisponibles = (idx) => {
        const p = presupuestosForm[idx];
        const tipoValor = p?.tipoPresupuesto?.valor;

        if (tipoValor === TIPO_HORAS_VALOR) {
            return (catalogos["CATEGORIA_PRESUPUESTO"] || [])
                .filter(c => c.valor === CAT_HORAS_VALOR);
        }

        const usadas = new Set();

        existentesContent
            .filter(e => e.id !== editandoId)
            .forEach(e => {
                const anio = obtenerAnio(e.fechaAsignacion);
                if (e.categoria && e.categoria !== "OTRO" && anio)
                    usadas.add(`${e.categoria}|${anio}`); // despliegue
            });

        presupuestosForm.forEach((pf, i) => {
            if (i === idx) return;

            const cat  = pf.categoria?.despliegue;
            const anio = obtenerAnio(pf.fechaAsignacion);

            if (cat && cat !== "OTRO" && anio)
                usadas.add(`${cat}|${anio}`);
        });

        const anioActual  = obtenerAnio(p?.fechaAsignacion);
        const catActual   = p?.categoria?.despliegue;

        return (catalogos["CATEGORIA_PRESUPUESTO"] || []).filter(cat => {
            if (cat.valor === "OTRO") return true;

            if (cat.despliegue === catActual) return true;

            if (!anioActual) return true;

            return !usadas.has(`${cat.despliegue}|${anioActual}`);
        });
    };

    // ── Edición / cancelar ────────────────────────────────────────────────

    const iniciarEdicion = (presupuestoReporte) => {
        // presupuestoReporte es PresupuestoReporteDTO (del listado)
        setEditandoId(presupuestoReporte.id);
        // usePresupuesto(id) se dispara y el useEffect pobla el form
    };

    const cancelarEdicion = () => {
        setEditandoId(null);
        setPresupuestosForm([{ ...PresupuestoDTO }]);
    };

    // ── Submit ────────────────────────────────────────────────────────────

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!proyecto?.codigoProyecto) { notify.warning("Selecciona un proyecto"); return; }

        // Validar categoria+año únicos
        const errorCombo = validarCategoriasUnicas(presupuestosForm, existentesContent, editandoId);
        if (errorCombo) { notify.warning(errorCombo); return; }

        // Validar tipo HORAS → solo categoría HORAS
        for (const p of presupuestosForm) {
            if (p.tipoPresupuesto?.valor === TIPO_HORAS_VALOR &&
                p.categoria?.valor !== CAT_HORAS_VALOR) {
                notify.error("El tipo Horas solo permite la categoría Horas Becarias");
                return;
            }
        }

        // Validar mínimo en edición (no bajar del monto ya usado)
        if (editandoId !== null) {
            const ok = await confirm.update();
            if (!ok) return;

            actualizar(presupuestosForm[0], {
                onSuccess: () => { notify.success("Presupuesto actualizado"); cancelarEdicion(); },
                onError:   (err) => notify.error(err?.response?.data?.message || "Error al actualizar")
            });

        } else {
            registrar(
                { codigoProyecto: proyecto.codigoProyecto, lista: presupuestosForm },
                {
                    onSuccess: () => {
                        notify.success("Presupuestos registrados");
                        setPresupuestosForm([{ ...PresupuestoDTO }]);
                    },
                    onError: (err) => notify.error(err?.response?.data?.message || "Error al registrar")
                }
            );
        }
    };

    // ── Seleccionar proyecto ──────────────────────────────────────────────

    const seleccionarProyecto = (p) => {
        setProyecto(p || null);
        setEditandoId(null);
        setPresupuestosForm([{ ...PresupuestoDTO }]);
        setPageable({ page: 0, size: 3 });
    };

    const handleIniciarEdicion = (presupuesto) => {
        iniciarEdicion(presupuesto);
        setTimeout(() => {
            formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 50);
    };

    const cambiarPagina = (nueva) => setPageable(prev => ({ ...prev, page: nueva }));

    // ── API pública ───────────────────────────────────────────────────────

    return {
        proyecto,
        seleccionarProyecto,

        catalogos,

        // Lista paginada
        existentes: existentesContent,
        totalElements,
        totalPages,
        loadingListado: listadoQuery.isLoading,
        pageable,
        cambiarPagina,

        // Formulario
        presupuestosForm,
        editandoId,
        isEditing:      editandoId !== null,
        isPending:      registrando || actualizando,
        cargandoEdicion: formQuery.isLoading,

        // Resumen del presupuesto en edición (PresupuestoReporteDTO)
        resumenEdicion: detalleQuery.data || null,

        // Handlers
        agregarPresupuesto,
        eliminarPresupuesto,
        handleCampoChange,
        handleTipoChange,
        setByPath,
        getCategoriasDisponibles,
        handleIniciarEdicion,
        formRef,
        cancelarEdicion,
        handleSubmit,
    };
};
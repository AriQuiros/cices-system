import { useState, useEffect } from "react";
import { useProyecto } from "../../context/proyectoCtx/UseProyecto.jsx";
import { useGuardarProyecto } from "./mutations/useGuardarProyecto.js";
import { useProyectoPorCodigo } from "./queries/useProyectoPorCodigo.js";
import { useCatalogos } from "../referenceDataHooks/useCatalogos.js";
import { useLineasInvestigacion } from "./queries/useLineasInvestigacion.js";
import { ProyectoDTO } from "../../modelos/proyectoDTO.jsx";
import { notify } from "../../utils/ui/notify.jsx";
import { confirm } from "../../utils/ui/confirm.jsx";

// ── Transformaciones puras (sin estado, fuera del hook) ──────────────────────

const agruparEntidades = (lista = []) => {
    const resultado = { instituciones: [], unidades: [], sitios: [] };
    lista.forEach(e => {
        const tipo = e?.tipo?.valor?.toUpperCase();
        if (tipo === "INSTITUCION") resultado.instituciones.push(e);
        if (tipo === "UNIDAD")      resultado.unidades.push(e);
        if (tipo === "SITIO")       resultado.sitios.push(e);
    });
    if (!resultado.instituciones.length) resultado.instituciones.push({ nombre: "" });
    if (!resultado.unidades.length)      resultado.unidades.push({ nombre: "" });
    if (!resultado.sitios.length)        resultado.sitios.push({ nombre: "" });
    return resultado;
};

const normalizarDocumentos = (docs = []) =>
    docs.map(d => ({ id: d.id, name: d.nombreDocumento, size: 0, url: d.url, esNuevo: false }));

const obtenerInformesValidos = (informes = []) =>
    informes.filter(i => i.tipoInforme?.valor && i.fechaPresentacion);

const aplanarEntidades = (entidades = {}) => [
    ...(entidades.unidades      || []).filter(e => e.nombre).map(e => ({ id: e.id, nombre: e.nombre.trim(), tipo: e.tipo })),
    ...(entidades.instituciones || []).filter(e => e.nombre).map(e => ({ id: e.id, nombre: e.nombre.trim(), tipo: e.tipo })),
    ...(entidades.sitios        || []).filter(e => e.nombre).map(e => ({ id: e.id, nombre: e.nombre.trim(), tipo: e.tipo })),
];

// ── Hook orquestador ─────────────────────────────────────────────────────────

export const useRegistroProyecto = ({ editable }) => {

    const { proyecto, establecerProyecto, limpiarProyecto, limpiarPresupuestoActual } = useProyecto();

    // ── Mutations y queries ──────────────────────────────────────────────────
    const { mutate: guardar, isPending } = useGuardarProyecto();

    const [codigoSeleccionado, setCodigoSeleccionado] = useState(null);
    const detalleQuery = useProyectoPorCodigo(codigoSeleccionado);

    // Catálogos — antes vivían dispersos en ProyectoDatosBasicos
    const catalogosQuery = useCatalogos(["TIPO_PROYECTO", "TIPO_META", "TIPO_INFORME"]);
    const catalogos      = catalogosQuery.data?.data ?? catalogosQuery.data ?? {};
    const tiposProyecto  = catalogos["TIPO_PROYECTO"] || [];
    const tipoMeta  = catalogos["TIPO_META"] || [];
    const tipoInforme  = catalogos["TIPO_INFORME"] || [];

    const lineasQuery    = useLineasInvestigacion();
    const opcionesLineas = (lineasQuery.data || []).map(l => ({ value: l, label: l }));

    // ── Effects ──────────────────────────────────────────────────────────────

    // Limpiar al alternar entre registro y edición
    useEffect(() => {
        limpiarProyecto();
        limpiarPresupuestoActual();
        setCodigoSeleccionado(null);
    }, [editable]);

    // Poblar formulario cuando llega el detalle del proyecto seleccionado
    useEffect(() => {
        if (!detalleQuery.data) return;
        const data = detalleQuery.data;
        establecerProyecto({
            ...data,
            entidadesVinculadas:    agruparEntidades(data.entidadesVinculadas),
            objetivosEspecificos:   data.objetivosEspecificos   || [],
            documentos:             normalizarDocumentos(data.documentos),
            presentacionesInformes: data.presentacionesInformes || []
        });
    }, [detalleQuery.data]);

    useEffect(() => {
        if (detalleQuery.isError) notify.error("Error cargando el proyecto");
    }, [detalleQuery.isError]);

    // ── Handlers ─────────────────────────────────────────────────────────────

    const seleccionarProyecto = (proyectoResumen) => {
        if (!proyectoResumen) {
            setCodigoSeleccionado(null);
            limpiarProyecto();
            return;
        }
        setCodigoSeleccionado(proyectoResumen.codigoProyecto);
    };

    const handleClear = () => {
        limpiarProyecto();
        limpiarPresupuestoActual();
        setCodigoSeleccionado(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (editable) {
            const ok = await confirm.update();
            if (!ok) return;
        }

        const docsNuevos = (proyecto.documentos || []).filter(d => d.esNuevo);

        const dto = {
            ...ProyectoDTO,
            ...proyecto,
            entidadesVinculadas:    aplanarEntidades(proyecto.entidadesVinculadas),
            presentacionesInformes: obtenerInformesValidos(proyecto.presentacionesInformes),
            documentos:             undefined
        };

        guardar(
            { dto, documentos: docsNuevos },
            {
                onSuccess: () => {
                    notify.success(
                        editable ? "Proyecto actualizado correctamente" : "Proyecto registrado exitosamente"
                    );
                    if (!editable) handleClear();
                },
                onError: (err) => {
                    notify.error(
                        err?.response?.data?.error  ||
                        err?.response?.data?.message ||
                        err?.message                 ||
                        "Error al procesar el proyecto"
                    );
                }
            }
        );
    };

    // ── API pública ──────────────────────────────────────────────────────────

    return {
        // Estado derivado
        codigoSeleccionado,
        cargandoDetalle: detalleQuery.isLoading,
        isPending,

        // Catálogos (para ProyectoDatosBasicos)
        tiposProyecto,
        tipoMeta,
        tipoInforme,
        opcionesLineas,
        cargandoLineas: lineasQuery.isLoading,

        // Handlers
        seleccionarProyecto,
        handleSubmit,
    };
};
import { useState, useRef } from "react";

import { useHorasPorPresupuesto } from "./queries/useHorasPorPresupuesto.js";
import { useRegistrarHoras } from "./mutations/useRegistrarHoras.js";
import { useActualizarHora } from "./mutations/useActualizarHora.js";
import { useEliminarHora } from "./mutations/useEliminarHora.js";
import { useHora } from "./queries/useHora.js";
import {useInvestigadoresPorProyecto} from "../investigadorProyectoHooks/queries/useInvestigadoresPorProyecto.js";
import {confirm} from "../../utils/ui/confirm.jsx";
import {notify} from "../../utils/ui/notify.jsx";
import {useCatalogos} from "../referenceDataHooks/useCatalogos.js";

export const useGestionHoras = (idPresupuesto, codigoProyecto) => {
    const formRef = useRef(null);

    // estado de tabla
    const [pageable, setPageable] = useState({ page: 0, size: 5 });
    const [ordenarPor, setOrdenarPor] = useState("fecha");
    const [direccion, setDireccion] = useState("desc");

    // estado de edición
    const [selectedId, setSelectedId] = useState(null);

    // query page
    const horasQuery = useHorasPorPresupuesto(
        idPresupuesto,
        pageable,
        "fechaInicioInvestigador",
        "desc"
    );

    // query detalle (DTO completo)
    const horaDetalleQuery = useHora(selectedId);
    const investigadoresQuery = useInvestigadoresPorProyecto(
        codigoProyecto,
        {size: 10, page:0},
        ordenarPor,
        direccion
    );
    const investigadores = investigadoresQuery.data?.content ?? [];

    const catalogosQuery = useCatalogos(["MODALIDAD_HORARIA", "TIPO_HORAS"]);
    const tipos = catalogosQuery.data?.data ?? catalogosQuery.data ?? {};

    // mutations
    const registrarMutation = useRegistrarHoras();
    const actualizarMutation = useActualizarHora();
    const eliminarMutation = useEliminarHora();

    // ACCIONES
    const seleccionarParaEditar = (id) => {
        setSelectedId(id);
    };

    const limpiarSeleccion = () => {
        setSelectedId(null);
    };

    const guardar =  (formData) => {
        if (selectedId) {
            const payload = Array.isArray(formData) ? formData[0] : formData;
            actualizarMutation.mutate(payload, {
                onSuccess: () => { notify.success("Horas actualizadas"); limpiarSeleccion(); },
                onError:   (err) => notify.error(err?.response?.data?.message || "Error al actualizar"),
            });
        } else {
            registrarMutation.mutate(formData, {
                onSuccess: () => notify.success("Horas registradas"),
                onError:   (err) => notify.error(err?.response?.data?.message || "Error al registrar"),
            });
        }
    };

    const eliminar = async (id) => {
        const ok = await confirm.delete();
        if (!ok) return;

        eliminarMutation.mutate(id, {
            onSuccess: () => {
                notify.success("Registro de horas eliminado");
                const totalActual = horasQuery.data?.total || 0;
                const totalPages  = Math.ceil((totalActual - 1) / pageable.size);
                if (pageable.page >= totalPages && totalPages > 0)
                    setPageable(prev => ({ ...prev, page: totalPages - 1 }));
            },
            onError: (err) => notify.error(err?.response?.data?.message || "Error al eliminar"),
        });
    };

    const handleEditarHora = (id) => {
        seleccionarParaEditar(id);
        setTimeout(() => {
            formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 50);
    };

    const cambiarPagina = (page) => {
        setPageable(prev => ({ ...prev, page }));
    };

    const cambiarSize = (size) => {
        setPageable(prev => ({ ...prev, size }));
    };

    const cambiarOrden = (campo) => {
        setOrdenarPor(campo);
        setDireccion(prev => (prev === "asc" ? "desc" : "asc"));
    };

    return {
        // tabla
        horas: horasQuery.data?.lista || [],
        total: horasQuery.data?.total || 0,
        totalPages: horasQuery.data?.totalPages || 0,
        isLoading: horasQuery.isLoading,

        // detalle
        horaSeleccionada: horaDetalleQuery.data,
        isLoadingDetalle: horaDetalleQuery.isLoading,

        // estado
        selectedId,

        // acciones
        handleEditarHora,
        formRef,
        limpiarSeleccion,
        guardar,
        eliminar,

        // paginación
        pageable,
        cambiarPagina,
        cambiarSize,

        // orden
        ordenarPor,
        direccion,
        cambiarOrden,

        // investigadores
        investigadores,

        //tipos
        tipos
    };
};

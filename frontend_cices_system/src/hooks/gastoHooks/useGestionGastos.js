import {useState, useRef} from "react";

import { useGastosPorPresupuesto } from "./queries/useGastoPorPresupuesto.js";
import { useRegistrarGasto } from "./mutations/useRegistrarGasto.js";
import { useActualizarGasto } from "./mutations/useActualizarGasto.js";
import { useEliminarGasto } from "./mutations/useEliminarGasto.js";
import { useGasto } from "./queries/useGasto.js";
import {confirm} from "../../utils/ui/confirm.jsx";
import {notify} from "../../utils/ui/notify.jsx";

export const useGestionGastos = (idPresupuesto) => {
    const formRef = useRef(null);

    // estado de tabla
    const [pageable, setPageable] = useState({ page: 0, size: 5 });
    const [ordenarPor, setOrdenarPor] = useState("fecha");
    const [direccion, setDireccion] = useState("desc");

    // estado de edición
    const [selectedId, setSelectedId] = useState(null);
    // query page
    const gastosQuery = useGastosPorPresupuesto(
        idPresupuesto,
        pageable,
        ordenarPor,
        direccion
    );

    // query detalle (DTO completo)
    const gastoDetalleQuery = useGasto(selectedId, {
        enabled: !!selectedId
    });

    // mutations
    const registrarMutation = useRegistrarGasto();
    const actualizarMutation = useActualizarGasto();
    const eliminarMutation = useEliminarGasto();

    // =========================
    // ACCIONES
    // =========================

    const seleccionarParaEditar = (id) => {
        setSelectedId(id);

    };

    const limpiarSeleccion = () => {
        setSelectedId(null);
    };

    const guardar = async (formData) => {
        if (selectedId) {
            const ok = await confirm.update();
            if (!ok) return;
            actualizarMutation.mutate(formData[0], {
                onSuccess: () => { notify.success("Gasto actualizado"); limpiarSeleccion(); },
                onError:   (err) => notify.error(err?.response?.data?.message || "Error al actualizar"),
            });
        } else {
            registrarMutation.mutate(formData, {
                onSuccess: () => notify.success("Gasto registrado"),
                onError:   (err) => notify.error(err?.response?.data?.message || "Error al registrar"),
            });
        }
    };

    const eliminar = async (id) => {
        const ok = await confirm.delete();
        if (!ok) return;

        eliminarMutation.mutate(id, {
            onSuccess: () => {
                notify.success("Gasto eliminado");
                const totalActual  = gastosQuery.data?.total || 0;
                const totalPages   = Math.ceil((totalActual - 1) / pageable.size);
                if (pageable.page >= totalPages && totalPages > 0)
                    setPageable(prev => ({ ...prev, page: totalPages - 1 }));
            },
            onError: (err) => notify.error(err?.response?.data?.message || "Error al eliminar"),
        });
    };

    const handleEditarGasto = (id) => {
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

    // =========================
    // RETURN
    // =========================

    return {
        // tabla
        gastos: gastosQuery.data?.lista || [],
        total: gastosQuery.data?.total || 0,
        totalPages: gastosQuery.data?.totalPages || 0,
        isLoading: gastosQuery.isLoading,

        // detalle (para form)
        gastoSeleccionado: gastoDetalleQuery.data,
        isLoadingDetalle: gastoDetalleQuery.isLoading,

        // estado
        selectedId,

        // acciones
        handleEditarGasto,
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
        cambiarOrden
    };
};
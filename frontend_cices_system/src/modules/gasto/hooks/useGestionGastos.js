import { useState } from "react";

import { useGastosPorPresupuesto } from "./queries/useGastoPorPresupuesto.js";
import { useRegistrarGasto } from "./mutations/useRegistrarGasto.js";
import { useActualizarGasto } from "./mutations/useActualizarGasto.js";
import { useEliminarGasto } from "./mutations/useEliminarGasto.js";
import { useGasto } from "./queries/useGasto.js";

export const useGestionGastos = (idPresupuesto) => {
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

    const guardar = (formData) => {
        // decide si crear o actualizar
        if (selectedId) {
            actualizarMutation.mutate(formData[0], {
                onSuccess: () => {
                    limpiarSeleccion();
                }
            });
        } else {
            registrarMutation.mutate(formData);
        }
    };

    const eliminar = (id) => {
        eliminarMutation.mutate(id, {
            onSuccess: () => {
                const totalActual = gastosQuery.data?.total || 0;
                const nuevaCantidad = totalActual - 1;

                const totalPages = Math.ceil(nuevaCantidad / pageable.size);

                if (pageable.page >= totalPages && totalPages > 0) {
                    setPageable(prev => ({
                        ...prev,
                        page: totalPages - 1
                    }));
                }
            }
        });
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
        seleccionarParaEditar,
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
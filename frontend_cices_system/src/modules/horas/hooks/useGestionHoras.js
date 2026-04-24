import { useState } from "react";

import { useHorasPorPresupuesto } from "./queries/useHorasPorPresupuesto.js";
import { useRegistrarHoras } from "./mutations/useRegistrarHoras.js";
import { useActualizarHora } from "./mutations/useActualizarHora.js";
import { useEliminarHora } from "./mutations/useEliminarHora.js";
import { useHora } from "./queries/useHora.js";
import {useInvestigadoresPorProyecto} from "../../investigadorProyecto/hooks/queries/useInvestigadoresPorProyecto.js";

export const useGestionHoras = (idPresupuesto, codigoProyecto) => {
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

    const guardar = (formData) => {
        if (selectedId) {
            const payload = Array.isArray(formData) ? formData[0] : formData;
            actualizarMutation.mutate(payload, {
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
                const totalActual = horasQuery.data?.total || 0;
                const nuevaCantidad = totalActual - 1;

                const totalPages = Math.ceil(nuevaCantidad / pageable.size);

                if (pageable.page >= totalPages && totalPages > 0) {
                    setPageable(prev => ({ ...prev, page: totalPages - 1 }));
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
        cambiarOrden,

        // investigadores
        investigadores
    };
};

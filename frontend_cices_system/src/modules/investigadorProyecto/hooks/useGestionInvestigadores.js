import { useState } from "react";
import { useInvestigadoresPorProyecto } from "./queries/useInvestigadoresPorProyecto.js";
import { useInvestigadorPorId } from "./queries/useInvestigadorPorId.js";
import { useAsignarInvestigadorProyecto } from "./mutations/useAsignarInvestigadorProyecto.js";
import { useActualizarInvestigadorProyecto } from "./mutations/useActualizarInvestigadorProyecto.js";
import { useEliminarInvestigadorProyecto } from "./mutations/useEliminarInvestigadorProyecto.js";

export const useGestionInvestigadores = (codigoProyecto) => {
    const [pageable, setPageable] = useState({ page: 0, size: 5 });
    const [selectedId, setSelectedId] = useState(null);

    const investigadoresQuery = useInvestigadoresPorProyecto(codigoProyecto, pageable, "nombreCompleto", "asc");
    const investigadorDetalleQuery = useInvestigadorPorId(selectedId);

    const asignarMutation = useAsignarInvestigadorProyecto();
    const actualizarMutation = useActualizarInvestigadorProyecto();
    const eliminarMutation = useEliminarInvestigadorProyecto();

    const seleccionarParaEditar = (id) => setSelectedId(id);
    const limpiarSeleccion = () => setSelectedId(null);

    const guardar = (lista) => {
        if (selectedId) {
            // actualizar espera un solo DTO
            const payload = Array.isArray(lista) ? lista[0] : lista;
            return actualizarMutation.mutate(payload);
        }

        return asignarMutation.mutate(lista);
    };

    const eliminar = (id) => eliminarMutation.mutate(id);

    const cambiarPagina = (page) => setPageable(prev => ({ ...prev, page }));

    return {
        investigadores: investigadoresQuery.data?.content || [],
        total: investigadoresQuery.data?.totalElements || 0,
        totalPages: investigadoresQuery.data?.totalPages || 0,
        isLoading: investigadoresQuery.isLoading,

        investigadorSeleccionado: investigadorDetalleQuery.data,
        isLoadingDetalle: investigadorDetalleQuery.isLoading,

        selectedId,

        seleccionarParaEditar,
        limpiarSeleccion,
        guardar,
        eliminar,

        pageable,
        cambiarPagina
    };
};


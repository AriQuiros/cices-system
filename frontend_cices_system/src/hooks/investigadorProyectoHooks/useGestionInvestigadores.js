import { useState, useRef } from "react";
import { useInvestigadoresPorProyecto } from "./queries/useInvestigadoresPorProyecto.js";
import { useInvestigadorPorId } from "./queries/useInvestigadorPorId.js";
import { useAsignarInvestigadorProyecto } from "./mutations/useAsignarInvestigadorProyecto.js";
import { useActualizarInvestigadorProyecto } from "./mutations/useActualizarInvestigadorProyecto.js";
import { useEliminarInvestigadorProyecto } from "./mutations/useEliminarInvestigadorProyecto.js";
import { useRolesProyecto } from "../referenceDataHooks/useRolesProyecto.js";
import {confirm} from "../../utils/ui/confirm.jsx";
import {notify} from "../../utils/ui/notify.jsx"; // ← nuevo

export const useGestionInvestigadores = (codigoProyecto) => {
    const formRef = useRef(null);

    const [pageable,    setPageable]    = useState({ page: 0, size: 5 });
    const [selectedId,  setSelectedId]  = useState(null);

    const investigadoresQuery      = useInvestigadoresPorProyecto(codigoProyecto, pageable, "nombreCompleto", "asc");
    const investigadorDetalleQuery = useInvestigadorPorId(selectedId);
    const rolesQuery               = useRolesProyecto(); // ← nuevo

    const asignarMutation    = useAsignarInvestigadorProyecto();
    const actualizarMutation = useActualizarInvestigadorProyecto();
    const eliminarMutation   = useEliminarInvestigadorProyecto();

    const seleccionarParaEditar = (id) => setSelectedId(id);
    const limpiarSeleccion      = ()    => setSelectedId(null);

    const guardar = async (lista) => {
        if (selectedId) {
            const ok = await confirm.update();
            if (!ok) return;

            const payload = Array.isArray(lista) ? lista[0] : lista;
            actualizarMutation.mutate(payload, {
                onSuccess: () => notify.success("Investigador actualizado correctamente"),
                onError:   (err) => notify.error(err?.response?.data?.message || "Error al actualizar"),
            });
        } else {
            asignarMutation.mutate(lista, {
                onSuccess: () => notify.success("Investigador(es) asignado(s) correctamente"),
                onError:   (err) => notify.error(err?.response?.data?.message || "Error al asignar"),
            });
        }
    };

    const eliminar = async (id) => {
        const ok = await confirm.delete();
        if (!ok) return;

        eliminarMutation.mutate(id, {
            onSuccess: () => notify.success("Investigador eliminado del proyecto"),
            onError:   (err) => notify.error(err?.response?.data?.message || "Error al eliminar"),
        });
    };

    const handleEditarInvestigador = (id) => {
        seleccionarParaEditar(id);
        setTimeout(() => {
            formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 50);
    };

    const cambiarPagina = (page) => setPageable(prev => ({ ...prev, page }));

    return {
        investigadores:  investigadoresQuery.data?.content || [],
        total:           investigadoresQuery.data?.totalElements || 0,
        totalPages:      investigadoresQuery.data?.totalPages || 0,
        isLoading:       investigadoresQuery.isLoading,

        investigadorSeleccionado: investigadorDetalleQuery.data,
        isLoadingDetalle:         investigadorDetalleQuery.isLoading,

        roles:           rolesQuery.data || [],  // ← expuesto
        loadingRoles:    rolesQuery.isLoading,

        selectedId,
        handleEditarInvestigador,
        formRef,
        limpiarSeleccion,
        guardar,
        eliminar,
        pageable,
        cambiarPagina,
    };
};
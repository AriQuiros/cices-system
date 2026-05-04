// src/modules/gasto/hooks/useModalBitacoraGasto.js
import { useState } from "react";
import { useBitacoraGasto } from "./queries/useBitacoraGasto.js";

export const useModalBitacoraGasto = () => {

    // gasto completo seleccionado (objeto con id, descripcion, monto, fechaGasto)
    const [gastoSeleccionado, setGastoSeleccionado] = useState(null);

    const bitacoraQuery = useBitacoraGasto(gastoSeleccionado?.id ?? null);

    const abrirModal = (gasto) => {
        setGastoSeleccionado(gasto);
    };

    const cerrarModal = () => {
        setGastoSeleccionado(null);
    };

    // ordenar de más reciente a más antiguo
    const bitacoraOrdenada = [...(bitacoraQuery.data || [])].sort(
        (a, b) => new Date(b.bitacora?.fecha) - new Date(a.bitacora?.fecha)
    );

    return {
        modalAbierto: gastoSeleccionado !== null,
        gastoSeleccionado,
        bitacoraOrdenada,
        isLoading: bitacoraQuery.isLoading,
        isError: bitacoraQuery.isError,
        abrirModal,
        cerrarModal
    };
};
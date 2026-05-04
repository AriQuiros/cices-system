import { useState } from "react";
import { useBitacoraPresupuesto } from "./queries/useBitacoraPresupuesto.js";

/**
 * Calcula la tendencia de cada entrada de la bitácora:
 *  "subio"  → el valor aumentó respecto al anterior
 *  "bajo"   → el valor disminuyó
 *  "igual"  → sin cambio en ese campo (puede cambiar otro)
 *
 * La bitácora viene ordenada desc (más reciente primero).
 * Para saber el valor "nuevo" de la entrada[i]:
 *   - Si i === 0: el valor actual del presupuesto (montoAsignado o horasTotal)
 *   - Si i > 0:   el valor Old de la entrada anterior (bitacora[i-1])
 */
const calcularTendencias = (bitacora, presupuesto) => {
    const esHoras = presupuesto?.tipoPresupuesto === "Horas";

    return bitacora.map((b, i) => {
        const anterior = bitacora[i - 1];

        if (esHoras) {
            const horasOld    = Number(b.cantidadHorasMesOld  || 0) * Number(b.cantidadMesesOld  || 0);
            const horasNuevo  = anterior
                ? Number(anterior.cantidadHorasMesOld || 0) * Number(anterior.cantidadMesesOld || 0)
                : Number(presupuesto?.cantidadHorasMes || 0) * Number(presupuesto?.cantidadMeses || 0);

            return {
                ...b,
                tendencia: horasNuevo > horasOld ? "subio" : horasNuevo < horasOld ? "bajo" : "igual"
            };
        }

        const montoOld   = Number(b.montoAsignadoOld || 0);
        const montoNuevo = anterior
            ? Number(anterior.montoAsignadoOld || 0)
            : Number(presupuesto?.montoAsignado || 0);

        return {
            ...b,
            tendencia: montoNuevo > montoOld ? "subio" : montoNuevo < montoOld ? "bajo" : "igual"
        };
    });
};

export const useModalBitacoraPresupuesto = () => {
    const [presupuestoSeleccionado, setPresupuestoSeleccionado] = useState(null);

    const bitacoraQuery = useBitacoraPresupuesto(presupuestoSeleccionado?.id ?? null);

    const bitacoraOrdenada = [...(bitacoraQuery.data || [])].sort(
        (a, b) => new Date(b.bitacora?.fecha) - new Date(a.bitacora?.fecha)
    );

    const bitacoraConTendencia = calcularTendencias(bitacoraOrdenada, presupuestoSeleccionado);

    const abrirModal  = (presupuesto) => setPresupuestoSeleccionado(presupuesto);
    const cerrarModal = ()            => setPresupuestoSeleccionado(null);

    return {
        modalAbierto:            presupuestoSeleccionado !== null,
        presupuestoSeleccionado,
        bitacoraConTendencia,
        isLoading: bitacoraQuery.isLoading,
        abrirModal,
        cerrarModal,
    };
};
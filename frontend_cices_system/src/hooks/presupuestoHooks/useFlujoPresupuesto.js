import { useState } from "react";
import { useBusquedaPresupuestos } from "./queries/useBusquedaPresupuestos.js";
import { usePresupuestoDetalle } from "./queries/usePresupuestoDetalle.js";

export const useFlujoPresupuesto = (tipoPresupuesto = null) => {
    const [busqueda, setBusqueda] = useState("");
    const [proyecto, setProyecto] = useState(null);
    const [presupuestoId, setPresupuestoId] = useState(null);

    // =========================
    // LISTA LIGERA (por proyecto)
    // =========================
    const presupuestosQuery = useBusquedaPresupuestos(
        {
            codigoProyecto: proyecto?.codigoProyecto,
            tipoPresupuesto: tipoPresupuesto,
            busqueda
        },
        { page: 0, size: 5 }
    );

    // =========================
    // DETALLE
    // =========================
    const detalleQuery = usePresupuestoDetalle(presupuestoId);

    // =========================
    // ACCIONES
    // =========================
    const seleccionarProyecto = (p) => {
        setProyecto(p);
        setPresupuestoId(null);
    };

    const seleccionarPresupuesto = (id) => {
        setPresupuestoId(id);
    };

    return {
        proyecto,
        seleccionarProyecto,

        presupuestos: presupuestosQuery.data || [],
        loadingPresupuestos: presupuestosQuery.isLoading,

        presupuestoId,
        seleccionarPresupuesto,

        presupuesto: detalleQuery.data,
        loadingDetalle: detalleQuery.isLoading,

        setBusquedaPresupuesto: setBusqueda
    };
};
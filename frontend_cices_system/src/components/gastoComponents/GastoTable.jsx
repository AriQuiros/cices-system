// src/modules/gasto/components/GastoTable.jsx
import { DataTable } from "../shared/DataTable.jsx";
import { formatearFechaCR } from "../../utils/formatoFechaCR.js";
import {formatearMonedaCR} from "../../utils/formatoNumeroCR.js";

export function GastoTable({
                               gastos,
                               onEdit,
                               onDelete,
                               soloLectura = false,
                               onVerCambios       // opcional: (gastoObjeto) => void
                           }) {

    const columns = [
        { key: "descripcion", label: "Descripción" },
        {
            key: "monto",
            label: "Monto",
            render: (row) => formatearMonedaCR( row.monto)
        },
        {
            key: "fechaGasto",
            label: "Fecha Gasto",
            render: (row) => formatearFechaCR(row.fechaGasto)
        }
    ];

    const actions = [];

    if (!soloLectura) {
        actions.push({ label: "Editar",   className: "btn-accion secundario", onClick: (row) => onEdit(row.id) });
        actions.push({ label: "Eliminar", className: "btn-accion peligro",    onClick: (row) => onDelete(row.id) });
    }

    if (onVerCambios) {
        // Pasa el objeto completo para que el modal tenga descripcion/monto/fechaGasto
        actions.push({ label: "Ver cambios", onClick: (row) => onVerCambios(row) });
    }

    return (
        <DataTable
            columns={columns}
            data={gastos}
            actions={actions}
        />
    );
}
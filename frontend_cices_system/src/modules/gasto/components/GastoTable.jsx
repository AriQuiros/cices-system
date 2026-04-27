// src/modules/gasto/components/GastoTable.jsx
import { DataTable } from "../../../components/ui/DataTable.jsx";
import { formatearFechaCR } from "../../../utils/formatoFecha.js";

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
            render: (row) => `₡${Number(row.monto).toLocaleString("es-CR")}`
        },
        {
            key: "fechaGasto",
            label: "Fecha Gasto",
            render: (row) => formatearFechaCR(row.fechaGasto)
        }
    ];

    const actions = [];

    if (!soloLectura) {
        actions.push({ label: "Editar",   onClick: (row) => onEdit(row.id) });
        actions.push({ label: "Eliminar", onClick: (row) => onDelete(row.id) });
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
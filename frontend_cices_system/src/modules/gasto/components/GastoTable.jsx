import {DataTable} from "../../../components/ui/DataTable.jsx";

export function GastoTable({ gastos, onEdit, onDelete }) {

    const columns = [
        { key: "descripcion", label: "Descripción" },
        { key: "monto", label: "Monto" },
        { key: "fechaGasto", label: "Fecha Gasto" }
    ];

    const actions = [
        { label: "Editar", onClick: (row) => onEdit(row.id) },
        { label: "Eliminar", onClick: (row) => onDelete(row.id) }
    ];

    return (
        <DataTable
            columns={columns}
            data={gastos}
            actions={actions}
        />
    );
}
// src/components/ui/DataTable.jsx
export function DataTable({ columns, data, actions = [] }) {
    const tieneAcciones = actions && actions.length > 0;

    return (
        <table className="gestion-gastos-table">
            <thead>
            <tr>
                {columns.map(col => <th key={col.key}>{col.label}</th>)}
                {tieneAcciones && <th>Acciones</th>}
            </tr>
            </thead>

            <tbody>
            {data?.map((row, idx) => (
                <tr key={row.id ?? idx}>
                    {columns.map(col => (
                        <td key={col.key}>
                            {col.render ? col.render(row) : row[col.key]}
                        </td>
                    ))}

                    {tieneAcciones && (
                        <td>
                            {actions.map(action => (
                                <button
                                    key={action.label}
                                    className={action.className || "btn-accion"}
                                    onClick={() => action.onClick(row)}
                                >
                                    {action.label}
                                </button>
                            ))}
                        </td>
                    )}
                </tr>
            ))}
            </tbody>
        </table>
    );
}
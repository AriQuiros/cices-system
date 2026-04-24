export function DataTable({ columns, data, actions = [] }) {
    return (
        <table>
            <thead>
            <tr>
                {columns.map(col => <th key={col.key}>{col.label}</th>)}
                <th>Acciones</th>
            </tr>
            </thead>

            <tbody>
            {data?.map(row => (
                <tr key={row.id}>
                    {columns.map(col => (
                        <td key={col.key}>
                            {row[col.key]}
                        </td>
                    ))}

                    <td>
                        {actions?.map(action => (
                            <button
                                key={action.label}
                                onClick={() => action.onClick(row)}
                            >
                                {action.label}
                            </button>
                        ))}
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}
import { DataTable } from "../../../components/ui/DataTable.jsx";

export function HoraTable({ data = [], onEdit, onDelete }) {

    const rows = data.map(h => ({
        id: h.id,
        investigador: h.investigador || "-",
        fechasInvestigador: (h.investigador?.fechaInicio || "") + " - " + (h.investigador?.fechaFin || ""),
        modalidad: h.modalidad || "-",
        tipoHora: h.tipoHora || "N/A",
        horasMes: h.horasMes,
        meses: h.meses,
        total: h.totalHorasAsignadas
    }));

    const columns = [
        { key: "investigador", label: "Investigador" },
        { key: "fechasInvestigador", label: "Fechas Investigador" },
        { key: "modalidad", label: "Modalidad" },
        { key: "tipoHora", label: "Tipo Hora" },
        { key: "horasMes", label: "Horas/Mes" },
        { key: "meses", label: "Meses" },
        { key: "total", label: "Total" }
    ];

    const actions = [
        { label: "Editar", onClick: (row) => onEdit(row.id) },
        { label: "Eliminar", onClick: (row) => onDelete(row.id) }
    ];

    return (
        <DataTable
            columns={columns}
            data={rows}
            actions={actions}
        />
    );
}


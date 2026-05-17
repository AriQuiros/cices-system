import { DataTable } from "../shared/DataTable.jsx";
import {formatearFechaCR} from "../../utils/formatoFechaCR.js";
import {formatearNumeroCR} from "../../utils/formatoNumeroCR.js";

export function HoraTable({ data = [], onEdit, onDelete }) {

    const rows = data.map(h => ({
        id: h.id,
        investigador: h.investigador || "-",
        fechasInvestigador: (formatearFechaCR(h?.fechaInicio) || "") + " - " + (formatearFechaCR(h?.fechaFin) || ""),
        modalidad: h.modalidad || "-",
        tipoHora: h.tiempo || "-",         // ← campo correcto del DTO
        horasMes: h.horasMes,
        meses: h.meses,
        total: formatearNumeroCR(h.totalHorasAsignadas)
    }));

    const columns = [
        { key: "investigador", label: "Investigador" },
        { key: "fechasInvestigador", label: "Fechas Participación" },
        { key: "modalidad", label: "Carga Académica" },
        { key: "tipoHora", label: "Tiempo" },
        { key: "horasMes", label: "Horas/Mes" },
        { key: "meses", label: "Meses" },
        { key: "total", label: "Total" }
    ];

    const actions = [
        { label: "Editar",   className: "btn-editar",   onClick: (row) => onEdit(row.id) },
        { label: "Eliminar", className: "btn-eliminar",  onClick: (row) => onDelete(row.id) }
    ];

    return (
        <DataTable
            columns={columns}
            data={rows}
            actions={actions}
        />
    );
}


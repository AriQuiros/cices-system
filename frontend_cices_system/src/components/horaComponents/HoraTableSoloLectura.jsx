// src/modules/horas/components/HoraTableSoloLectura.jsx
import { DataTable } from "../shared/DataTable.jsx";
import { formatearFechaCR } from "../../utils/formatoFechaCR.js";
import {formatearNumeroCR} from "../../utils/formatoNumeroCR.js";

export function HoraTableSoloLectura({ data = [] }) {

    const rows = data.map(h => ({
        id: h.id,
        investigador: h.investigador || "—",
        fechasInvestigador:
            (formatearFechaCR(h?.fechaInicio) || "") +
            " - " +
            (formatearFechaCR(h?.fechaFin) || ""),
        modalidad: h.modalidad || "—",
        tipoHora: h.tipoHora || "N/A",
        horasMes: h.horasMes,
        meses: h.meses,
        total: formatearNumeroCR(h.totalHorasAsignadas)
    }));

    const columns = [
        { key: "investigador",       label: "Investigador" },
        { key: "fechasInvestigador", label: "Fechas Participación" },
        { key: "modalidad",          label: "Modalidad" },
        { key: "tipoHora",           label: "Tipo Hora" },
        { key: "horasMes",           label: "Horas/Mes" },
        { key: "meses",              label: "Meses" },
        { key: "total",              label: "Total" }
    ];

    return (
        <DataTable
            columns={columns}
            data={rows}
            actions={[]}
        />
    );
}
import React from "react";
import {formatearFechaCR} from "../../utils/formatoFechaCR.js";

export default function PermisoProyectoTable({ permisos = [], onRemove }) {
    if (!permisos || permisos.length === 0) return <p>No hay permisos asignados</p>;

    return (
        <table className="tabla-horas">
            <thead>
            <tr>
                <th>Investigador</th>
                <th>Identificación</th>
                <th>Fecha inicio</th>
                <th>Fecha fin</th>
                <th>Acciones</th>
            </tr>
            </thead>

            <tbody>
            {permisos.map(p => (
                <tr key={p.id}>
                    <td>{p.nombreInvestigador}</td>
                    <td>{p.identificacionInvestigador}</td>
                    <td>{formatearFechaCR(p.fechaInicio)}</td>
                    <td>{formatearFechaCR(p.fechaFin )|| "Indefinida"}</td>
                    <td>
                        <button className="btn-danger" onClick={() => onRemove && onRemove(p.id)}>
                            Remover
                        </button>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}


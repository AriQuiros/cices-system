import React from "react";
import {formatearFechaCR} from "../../utils/formatoFechaCR.js";

export const InvestigadorTable = ({ investigadores, onEdit, onDelete }) => {
    return (
        <div>
            <h3>Investigadores vinculados</h3>

            <table className="tabla-horas">
                <thead>
                    <tr>
                        <th>Investigador</th>
                        <th>Rol</th>
                        <th>Período</th>
                        <th>Actividad</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {investigadores.map(inv => (
                        <tr key={inv.id}>
                            <td>{inv.nombreCompleto}</td>
                            <td>{inv.rolProyecto}</td>
                            <td>{formatearFechaCR(inv.fechaInicio)} - {formatearFechaCR(inv.fechaFin)}</td>
                            <td>{inv.actividadProyecto}</td>
                            <td className="acciones">
                                <button type="button" className="btn-editar" onClick={() => onEdit(inv.id)}>Editar</button>
                                <button type="button" className="btn-eliminar" onClick={() => onDelete(inv.id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default InvestigadorTable;


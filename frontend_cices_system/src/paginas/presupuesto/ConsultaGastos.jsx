import React, { useEffect, useState } from "react";
import { DetalleGastos } from "../../services/ReportesService.jsx";

const GastosAsignados = ({ codigoProyecto , presupuesto }) => {

    const [presupuestos, setPresupuestos] = useState([]);

    useEffect(() => {
        if (!presupuesto && codigoProyecto) {
            cargarDatosProyecto();
        } else if (presupuesto) {
            setPresupuestos([presupuesto]);
        }
    }, [codigoProyecto, presupuesto]);

    const cargarDatosProyecto = async () => {
        try {
            const data = await DetalleGastos.obtenerPorProyecto(codigoProyecto);
            setPresupuestos(data);
        } catch (error) {
            console.error(error);
        }
    };

    const totalGastos = (gastos) => {
        return gastos.reduce((acc, g) => acc + parseFloat(g.monto), 0);
    };

    if (!presupuestos || presupuestos.length === 0) return <p>No hay datos para mostrar.</p>;

    return (
        <div>
            {presupuestos.map((p, index) => {
                const asignado = totalGastos(p.gastos);
                const restante = parseFloat(p.monto) - asignado;

                return (
                    <div key={index}>
                        <p><b>Descripción:</b> {p.descripcion}</p>
                        <p><b>Categoría:</b> {p.categoria}</p>
                        <p><b>Fecha asignación:</b> {p.fechaAsignacion}</p>
                        <p><b>Tipo:</b> {p.tipoPresupuesto}</p>
                        <p><b>Fuente de financiamiento:</b> {p.fuenteFinanciamiento}</p>
                        <p><b>Monto Asignado:</b> {p.monto}</p>
                        <p><b>Total gastos:</b> {asignado}</p>
                        <p><b>Saldo restante:</b> {restante}</p>

                        <h4>Detalle de gastos</h4>
                        <table border="1">
                            <thead>
                            <tr>
                                <th>Descripción</th>
                                <th>Fecha</th>
                                <th>Monto</th>
                            </tr>
                            </thead>
                            <tbody>
                            {p.gastos.map((g, i) => (
                                <tr key={i}>
                                    <td>{g.descripcion}</td>
                                    <td>{new Date(g.fecha).toLocaleDateString()}</td>
                                    <td>{g.monto}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>

                        <hr/>
                    </div>
                );
            })}
        </div>
    );
};

export default GastosAsignados;